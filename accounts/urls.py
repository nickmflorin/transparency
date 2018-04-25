import sys
sys.dont_write_bytecode = True

from django.conf.urls import include, url
from django.views.generic import TemplateView
from django.views.decorators.csrf import csrf_exempt

# Front End Uses JWT Decoding so Use JWT Tokens
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework_jwt.views import obtain_jwt_token
from rest_framework.routers import SimpleRouter
from rest_framework import routers

from views import Logout, Login 
from viewsets import TransparencyAppViewSet

router = routers.SimpleRouter()
router.register(r'apps', TransparencyAppViewSet, r"apps")

urlpatterns = [
	url(r'^login/$', csrf_exempt(Login.as_view()), name='login'),
	url(r'^logout/$', csrf_exempt(Logout.as_view()), name='logout'),
    url(r'^token/obtain/$', csrf_exempt(obtain_jwt_token)),
    url(r'^', include(router.urls, namespace='accounts')),
]

