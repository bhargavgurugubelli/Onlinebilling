from django.shortcuts import render
from rest_framework.decorators import api_view, parser_classes, permission_classes
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .serializers import SalesInvoiceSerializer
from .models import SalesInvoice, MenuItem
from django.db.models import Sum
import fitz  # PyMuPDF

# ✅ 1. Create Sales Invoice (returns order_id)
@api_view(['POST'])
# @permission_classes([IsAuthenticated])
def create_invoice(request):
    serializer = SalesInvoiceSerializer(data=request.data)
    if serializer.is_valid():
        invoice = serializer.save()
        return Response({
            'status': 'success',
            'invoice_id': invoice.id,
            'order_id': invoice.order_id,
            'customer_name': invoice.customer_name,
            'total_amount': invoice.total_amount
        }, status=status.HTTP_201_CREATED)
    return Response({'status': 'error', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


# ✅ 2. Upload PDF and extract menu items
@api_view(['POST'])
@parser_classes([MultiPartParser])
@permission_classes([IsAuthenticated])
def upload_menu_pdf(request):
    pdf_file = request.FILES.get('pdf') # ✅ match the frontend key name

    if not pdf_file:
        return Response({"error": "No PDF uploaded"}, status=400)

    try:
        doc = fitz.open(stream=pdf_file.read(), filetype="pdf")
        items = []

        for page in doc:
            text = page.get_text()
            for line in text.split('\n'):
                parts = line.rsplit(' ', 1)
                if len(parts) == 2 and parts[1].isdigit():
                    name, rate = parts
                    items.append(MenuItem(
                        business=request.user.business,  # assumes user has business field
                        name=name.strip(),
                        rate=float(rate.strip())
                    ))

        MenuItem.objects.bulk_create(items, ignore_conflicts=True)
        return Response({"status": "success", "items_added": len(items)}, status=201)

    except Exception as e:
        return Response({"error": str(e)}, status=500)


# ✅ 3. Search for menu items by name (autocomplete)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_menu_items(request):
    query = request.GET.get('q', '')
    items = MenuItem.objects.filter(
        business=request.user.business,
        name__icontains=query
    )[:10]

    data = [{'id': item.id, 'name': item.name, 'rate': item.rate} for item in items]
    return Response(data)


# ✅ 4. List all invoices for dashboard (latest transactions)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_invoices(request):
    invoices = SalesInvoice.objects.filter(business=request.user.business).order_by('-created_at')
    serializer = SalesInvoiceSerializer(invoices, many=True)
    return Response(serializer.data)


# ✅ 5. Dashboard Summary API (for dashboard cards)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_summary(request):
    business = getattr(request.user, 'business', None)

    invoices = SalesInvoice.objects.filter(business=business)

    total_invoices = invoices.count()
    total_sales = invoices.aggregate(Sum('total_amount'))['total_amount__sum'] or 0
    latest_invoice = invoices.order_by('-created_at').first()
    pending_orders = invoices.filter(status='pending').count()

    return Response({
        'total_invoices': total_invoices,
        'total_sales': total_sales,
        'latest_order_id': latest_invoice.order_id if latest_invoice else None,
        'pending_orders': pending_orders,
    })
