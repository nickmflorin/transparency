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

class ManagerSearchViewSet(viewsets.ReadOnlyModelViewSet):
	lookup_field = 'id'
	serializer_class = ManagerSimpleSerializer

	def get_queryset(self):
		search = self.request.GET.get('search')
		limit = int(self.request.GET.get('limit', 20))

		if not search or str(search).strip() == "":
			return []

		client = pymongo.MongoClient("localhost", 27017, maxPoolSize=50)
		db = client['peers']
		collection = db['managers']

		models = list(collection.find(
		   {"name" : {"$regex" : search, "$options" : "i"}},
		   {"_id" : 1, "name" : 1}
		).limit(limit))

		queryset = []
		for model in models:
			queryset.append(Manager(id = model['_id'], name = model["name"]))
		return queryset

	def destroy(self, request, *args, **kwargs):
		instance = self.get_object()
		self.get_serializer().destroy(instance)
		print("Instance destroyed!")
		return response.Response(status=status.HTTP_204_NO_CONTENT)

class ManagerViewSet(viewsets.ModelViewSet):
	lookup_field = 'id'
	serializer_class = ManagerSerializer

	def get_queryset(self):
		id = self.request.query_params.get('id', None)
		if id: raise Exception('Error: Must Query Specific Manager by Extending API URL with Manager ID...')

		ids = self.request.query_params.get('ids', None)
		if ids:
			ids = json.loads(ids)
			ids = [ int(x) for x in ids ]

		# ID Handled by Normal Retrieve Method!
		if ids:
			queryset = Manager.objects.filter(id__in=ids)
		else:
			queryset = Manager.objects.all()
		return queryset

	def destroy(self, request, *args, **kwargs):
		instance = self.get_object()
		self.get_serializer().destroy(instance)
		print("Instance destroyed!")
		return response.Response(status=status.HTTP_204_NO_CONTENT)

