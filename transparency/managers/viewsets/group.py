import sys
sys.dont_write_bytecode = True
import json 
import pymongo

from rest_framework import response, viewsets
from rest_framework.decorators import detail_route
from rest_framework import generics

from ..serializers import *
from ..models import Manager, ManagerReturns, ManagerExposure, ManagerGroupSet, ManagerGroup, ManagerGroupReference

import re

class ManagerGroupViewSet(viewsets.ModelViewSet):
	serializer_class = ManagerGroupSetSerializer

	# To Do: Include Options to Include/Exclude Peers and Benchmarks?
	# Included by Default
	def get_queryset(self):
		ids = self.request.query_params.get('ids', None)
		if ids:
			ids = json.loads(ids)
			ids = [ int(x) for x in ids ]
		
		managers = Manager.objects.filter(id__in = ids).all()
		if len(managers) == 0:
			print 'Warning: No Valid Managers Supplied'
			return []

		# Default to True Inside Model
		include_benchmarks = self.request.query_params.get('include_benchmarks', True)
		include_peers = self.request.query_params.get('include_peers', True)

		group = ManagerGroupSet.group(managers, include_peers = include_peers, include_benchmarks = include_benchmarks)
		return [group]

	def destroy(self, request, *args, **kwargs):
		instance = self.get_object()
		self.get_serializer().destroy(instance)
		print("Instance destroyed!")
		return response.Response(status=status.HTTP_204_NO_CONTENT)
