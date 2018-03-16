import sys
sys.dont_write_bytecode = True

from django.conf.urls import include, url
from django.views.decorators.csrf import csrf_exempt

from rest_framework.authtoken.views import obtain_auth_token
from rest_framework.routers import SimpleRouter
from rest_framework import routers

import viewsets 

router = routers.SimpleRouter()
router.register(r'databases', viewsets.DatabaseViewSet, r"databases")
router.register(r'query', viewsets.DatabaseQueryResultsViewSet, r"query")

urlpatterns = [
	url(r'^', include(router.urls, namespace='db')),
    url(r'^databases', include(router.urls, namespace='databases')),
    url(r'^query', include(router.urls, namespace='query')),
]
