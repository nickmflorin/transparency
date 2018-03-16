import sys
sys.dont_write_bytecode = True
import json 
import pymongo

from rest_framework import response, viewsets
from rest_framework.decorators import detail_route
from rest_framework import generics

from ..serializers import *
from ..models import Manager, ManagerReturns, ManagerExposure

import re

class ManagerExposureViewSet(viewsets.ModelViewSet):
	serializer_class = ExposureSerializer

	# To Do: Also Allow Filter by Date
	def get_queryset(self):
		id = self.request.query_params.get('id', None)
		if not id:
			raise Exception('Must Specify ID')
		print 'getting exposures for : ',id
		return ManagerExposure.objects.filter(manager_id = int(id)).all()
	
	def destroy(self, request, *args, **kwargs):
		instance = self.get_object()
		self.get_serializer().destroy(instance)
		print("Instance destroyed!")
		return response.Response(status=status.HTTP_204_NO_CONTENT)
