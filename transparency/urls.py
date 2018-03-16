import sys
sys.dont_write_bytecode = True

from django.conf.urls import include, url
from django.views.generic import TemplateView
from django.views.decorators.csrf import csrf_exempt

from django.contrib import admin
from django.contrib.auth.views import logout 
from rest_framework.authtoken import views

urlpatterns = [
	url(r'^$', TemplateView.as_view(template_name="index.html")),
	url(r'^admin/', admin.site.urls),
	url(r'^accounts/', include('transparency.accounts.urls')),
    url(r'^managers/', include('transparency.managers.urls')),
    url(r'^db/', include('transparency.db.urls')),
    url(r'^lists/', include('transparency.lists.urls')),

    # If We Include $, Everytime Server Reboots the URL After / Will Not be Found Unless We Duplicate API Routes Above This Route
    url('.*', TemplateView.as_view(template_name='index.html')),
]
