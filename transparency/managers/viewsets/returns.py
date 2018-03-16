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

# Only Serializes Single Field for Manager and Returns No Other Fields
class ManagerReturnViewSet(viewsets.ModelViewSet):
	lookup_field = 'id'
	serializer_class = ManagerReturnsSerializer
	
	def get_queryset(self):

		id = self.request.query_params.get('id', None)
		ids = self.request.query_params.get('ids', None)
		if ids:
			ids = json.loads(ids)
			ids = [ int(x) for x in ids ]

		if id is not None:
			id = int(id)
			queryset = Manager.objects.only('returns').filter(id=id).all()
		elif ids is not None:
			queryset = Manager.objects.only('returns').filter(id__in=ids).all()
		else:
			raise Exception('Must Provide Specific ID or IDs for Manager Returns')
		return queryset

	def destroy(self, request, *args, **kwargs):
		instance = self.get_object()
		self.get_serializer().destroy(instance)
		print("Instance destroyed!")
		return response.Response(status=status.HTTP_204_NO_CONTENT)
