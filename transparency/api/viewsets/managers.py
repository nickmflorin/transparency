import sys
sys.dont_write_bytecode = True
import json 
import pymongo

from rest_framework import response, viewsets
from rest_framework.decorators import detail_route
from rest_framework import generics

import transparency.api.serializers as serialize
from transparency.api.models import Manager, ManagerReturns

import re

class ManagerSearchViewSet(viewsets.ReadOnlyModelViewSet):
	lookup_field = 'id'
	serializer_class = serialize.manager.ManagerSearchSerializer

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

# Only Serializes Single Field for Manager and Returns No Other Fields
class ManagerReturnViewSet(viewsets.ModelViewSet):
	lookup_field = 'id'
	serializer_class = serialize.returns.ManagerReturnsSerializer
	
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

class ManagerViewSet(viewsets.ModelViewSet):
	lookup_field = 'id'
	serializers = {
		'extended' : serialize.manager.ManagerExtendedSerializer,
		'default' : serialize.manager.ManagerSerializer,
	}

	def get_serializer_class(self):
		extended = self.request.query_params.get('extended', None)
		if extended:
			return self.serializers['extended']
		return self.serializers['default']

	def get_queryset(self):
		extended = self.request.query_params.get('extended', None)
		ids = self.request.query_params.get('ids', None)
		if ids:
			ids = json.loads(ids)
			ids = [ int(x) for x in ids ]
		else:
			ids = self.request.query_params.getlist('ids[]',None)
			if ids:
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

