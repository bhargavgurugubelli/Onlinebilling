from django.urls import path
from .views import (
    create_invoice,
    upload_menu_pdf,
    search_menu_items,
    list_invoices,
    dashboard_summary
)

urlpatterns = [
    path('create-invoice/', create_invoice, name='create-invoice'),
    path('upload-menu/', upload_menu_pdf, name='upload-menu'),
    path('search-items/', search_menu_items, name='search-items'),
    path('list-invoices/', list_invoices, name='list-invoices'),  # ✅ for recent transactions
    path('summary/', dashboard_summary, name='dashboard-summary'),
    # path('menu-items/', list_menu_items, name='list-menu-items'),  # ✅ for dashboard cards
]
