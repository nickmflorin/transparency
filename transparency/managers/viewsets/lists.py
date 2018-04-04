import sys
sys.dont_write_bytecode = True
import datetime 
from django.http import HttpResponse
import json

from rest_framework import response, filters, viewsets
from rest_framework.decorators import detail_route
from rest_framework.response import Response 
from rest_framework.authtoken.models import Token

import transparency.utility as utility

from ..serializers import *
from ..models import ManagerList, Manager

class ManagerListViewSet(viewsets.ModelViewSet):
	lookup_field = 'id'

	def get_serializer_class(self):
		if self.action == 'retrieve':
			return ManagerListDetailSerializer
		return ManagerListSerializer

	# Forces Refresh
	def get_queryset(self):
		return ManagerList.objects.all()

	def update(self, request, id=None):
		resp = {}

		manager_list = ManagerList.objects.filter(id = id).first()
		if not manager_list:
			raise Exception('Invalid List ID')

		managers = utility.request.parse_list(request, 'managers', method='POST', default = [])
		if len(managers) == 0:
			resp['error'] = 'Cannot Update List with Empty Set of Managers'
			return response.Response(resp)

		current = [int(a.id) for a in manager_list.managers]
		for manager_id in managers:
			manager = Manager.objects.filter(id = manager_id).first()
			if not manager:
				raise Exception('Found Invalid Manager ID {}'.format(manager_id))

			if manager.id not in current:
				print 'Adding New Manager {} to Manager List {}'.format(manager_id, id)
				manager_list.managers.append(manager)

		manager_list.save()
		serial = ManagerListSerializer(manager_list)
		return response.Response(serial.data)

	def create(self, request):
		resp = {}

		name = request.POST.get('name')
		if not name:
			resp['error'] = 'Must Provide List Name' # Should be Prevented in Front End
			return response.Response(resp)

		# Raise Exception? -> Should be Prevented in Front End
		managers = utility.request.parse_list(request, 'managers', method='POST', default = [])
		if len(managers) == 0:
			resp['error'] = 'Cannot Save Empty Lists'
			return response.Response(resp)

		# Only Error That Should Not Have Been Automatically Prevented Ahead of Time
		mgrlist = ManagerList.objects.filter(name = name).first()
		if mgrlist:
			print 'Error : Manager List Name Already Exists'
			resp['error'] = 'Manager List Name Already Exists'
			return response.Response(resp)
		
		newlist = ManagerList(name = name, createdAt = datetime.datetime.now(), managers = [], user = request.user.id)
		for id in managers:
			manager = Manager.objects.filter(id = id).first()
			if not manager:
				raise Exception('Found Invalid Manager ID {}'.format(id))
			newlist.managers.append(manager)
		
		newlist.save()
			
		created = ManagerList.objects.filter(id = newlist.id).first()
		serial = ManagerListSerializer(created)
		return response.Response(serial.data)

	def destroy(self, request, *args, **kwargs):
		instance = self.get_object()
		self.get_serializer().destroy(instance)
		print("Instance destroyed!")
		return response.Response(status=status.HTTP_204_NO_CONTENT)


