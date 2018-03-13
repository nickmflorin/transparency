import sys
sys.dont_write_bytecode = True

from django.conf.urls import include, url
from django.views.decorators.csrf import csrf_exempt

from rest_framework.authtoken.views import obtain_auth_token
from rest_framework.routers import SimpleRouter
from rest_framework import routers

from apps import ApiConfig
import viewsets 

router = routers.SimpleRouter()

router.register(r'managers', viewsets.ManagerViewSet, r"managers")
router.register(r'returns', viewsets.ManagerReturnViewSet, r"returns")
router.register(r'mgrsearch', viewsets.ManagerSearchViewSet, r"mgrsearch")
router.register(r'managerlists', viewsets.ManagerListViewSet, r"managerlists")
router.register(r'databases', viewsets.DatabaseViewSet, r"databases")
router.register(r'query', viewsets.DatabaseQueryResultsViewSet, r"query")

urlpatterns = [
	url(r'^', include(router.urls, namespace='api')),
	
    # Redeclaration of API Routes Required Because React/Browser Handles Other Routes Off of /
    url(r'^managers', include(router.urls, namespace='api')),
    url(r'^mgrsearch', include(router.urls, namespace='api')),
    url(r'^managerlists', include(router.urls, namespace='api')),
    url(r'^databases', include(router.urls, namespace='api')),
    url(r'^query', include(router.urls, namespace='api')),
]

ApiConfig.startup()