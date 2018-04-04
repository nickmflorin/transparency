import sys
sys.dont_write_bytecode = True
import json 
import pymongo

from rest_framework import response, viewsets
from rest_framework.decorators import detail_route
from rest_framework import generics

from transparency.config.models import Range 
from ..serializers import *
from ..models import ManagerExposure, Manager, ManagerReturns
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

# Cannot Pass in Start or End Dates to Manager, The Range Will be Defaulted to Today's Date
class ManagerViewSet(viewsets.ModelViewSet):
	lookup_field = 'id'
	serializer_class = ManagerSerializer
	#queryset = Manager.objects.all()

	def get_queryset(self):
		return Manager.objects.all()

	def destroy(self, request, *args, **kwargs):
		instance = self.get_object()
		self.get_serializer().destroy(instance)
		print("Instance destroyed!")
		return response.Response(status=status.HTTP_204_NO_CONTENT)

