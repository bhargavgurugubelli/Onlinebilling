from django.shortcuts import redirect

from django.conf import settings
from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static

urlpatterns = [

  path('admin/', admin.site.urls),
  path('api/accounts/', include('accounts.urls')),

  # path('', include('subscriptions.urls')),
  path('api/', include('subscriptions.urls')),
  path('products/', include('products.urls')),
  path('pricing/', include('pricing.urls')),
  path('pricing-table/', include('pricingtable.urls')),
  path('redirect/', include('pricingtable.urls')),
  path('services/', include('services.urls')),
  path('about/', include('about.urls')),
  path('contact/', include('contact.urls')),
  path('hero/', include('hero.urls')),
  path('footer/', include('footer.urls')),
  path('api/sales/', include('sales.urls')),  
  path('api/kitchen/', include('kitchen.urls')),
  path('api/', include('authotp.urls')),


]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Custom Admin titles
admin.site.site_header = settings.SITE_HEADER
admin.site.site_title = settings.SITE_TITLE
admin.site.index_title = settings.INDEX_TITLE
