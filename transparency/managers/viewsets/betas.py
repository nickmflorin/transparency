import sys
sys.dont_write_bytecode = True
import json 
import pymongo

from rest_framework import response, viewsets
from rest_framework.decorators import detail_route
from rest_framework import generics

import transparency.utility as utility
from transparency.config.models import Range

from ..serializers import *
from ..models import ManagerBetaSet, ManagerBetas, Manager, ManagerGroup

import re

class ManagerBetaViewSet(viewsets.ModelViewSet):
	lookup_field = 'id'
	serializer_class = ManagerBetasSerializer

	def get_queryset(self):
		return ManagerBetas.objects.all()

	# To Do: Incorporate Start and End Dates as Well
	# To Do: Allow Options to Include Benchmarks and Peers as Well
	def retrieve(self, request, id=None):
		if not id: raise Exception('Must Provide Primary Key for Betas Query')
		id = int(id)

		manager_ids = utility.request.parse_list(request, 'managers', default = [])
		group_ids = utility.request.parse_list(request, 'groups', default = [])
	
		range_ = utility.request.parse_range(request)
		range_.validate()	

		# Group Names Can Be Supplied
		groups, managers = [], []
		for group_id in group_ids:
			group = ManagerGroup.objects.filter(id = str(group_id)).first()
			if not group:
				raise Exception('Invalid Group')
			groups.append(group)

		for manager_id in manager_ids:
			manager = Manager.objects.filter(id = id).only('returns').first()
			if not manager:
				raise Exception('Invalid Manager ID')
			managers.append(manager)

		# Going to Have to Include Peers and Benchmarks Back in Query When We Want Them
		manager = Manager.objects.filter(id = id).only('returns').first()
		if not manager:
			raise Exception('Invalid Manager ID')

		betas = ManagerBetas(manager = manager, betas = [], groups = groups, managers = managers, range = range_)
		serial = ManagerBetasSerializer(betas)
		return response.Response(serial.data)

	def destroy(self, request, *args, **kwargs):
		instance = self.get_object()
		self.get_serializer().destroy(instance)
		print("Instance destroyed!")
		return response.Response(status=status.HTTP_204_NO_CONTENT)
