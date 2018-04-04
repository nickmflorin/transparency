import sys
sys.dont_write_bytecode = True

from django.conf.urls import include, url
from django.views.decorators.csrf import csrf_exempt

from rest_framework.authtoken.views import obtain_auth_token
from rest_framework.routers import SimpleRouter
from rest_framework import routers

import viewsets 

router = routers.SimpleRouter()

router.register(r'returns', viewsets.ManagerReturnViewSet, r"returns")
router.register(r'exposures', viewsets.ManagerExposureViewSet, r"exposures")
router.register(r'lists', viewsets.ManagerListViewSet, r"lists")
router.register(r'betas', viewsets.ManagerBetaViewSet, r"betas")
router.register(r'categories', viewsets.ManagerCategoryExposureViewSet, r"categories")
router.register(r'search', viewsets.ManagerSearchViewSet, r"search")
router.register(r'', viewsets.ManagerViewSet, r"managers")

urlpatterns = [
	url(r'^', include(router.urls, namespace='managers')),
]
