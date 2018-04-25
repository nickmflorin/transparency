import sys
sys.dont_write_bytecode = True
import json 
import pymongo

from rest_framework import response, viewsets
from rest_framework.decorators import detail_route
from rest_framework import generics

import common.utility as utility 
from ..serializers import *
from ..models import ManagerExposure, ManagerExposures

import re

# TO DO: Maybe Come Up With Another Way for Returning Single Date Formatted Exposures?
class ManagerExposureViewSet(viewsets.ModelViewSet):
	serializer_class = ExposuresSerializer
	lookup_field = 'manager_id'
	query_set = ManagerExposures.objects.all()

	def retrieve(self, request, manager_id=None):
		if not manager_id:
			raise Exception('Must Provide Primary Key for Exposures Query')
		manager_id = int(manager_id)

		date = utility.request.parse_date(request) # Automatically Converts to EOMONTh

		if date:
			exposures = ManagerExposure.objects.filter(manager_id = manager_id, date = date).all()
		else:
			exposures = ManagerExposure.objects.filter(manager_id = manager_id).all()
		
		exposure = ManagerExposures(id = manager_id, exposures = exposures)
		serial = ExposuresSerializer(exposure, context={'request': request, 'id' : manager_id})
		return response.Response(serial.data)

	def destroy(self, request, *args, **kwargs):
		instance = self.get_object()
		self.get_serializer().destroy(instance)
		print("Instance destroyed!")
		return response.Response(status=status.HTTP_204_NO_CONTENT)
