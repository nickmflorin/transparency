import sys
sys.dont_write_bytecode = True

from django.conf.urls import include, url
from django.views.decorators.csrf import csrf_exempt

from rest_framework.authtoken.views import obtain_auth_token
from rest_framework.routers import SimpleRouter
from rest_framework import routers

import viewsets 

router = routers.SimpleRouter()

urlpatterns = []
