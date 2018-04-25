import sys
sys.dont_write_bytecode = True
import datetime 
from django.http import Http404, HttpResponse
import json

from rest_framework import response, filters, viewsets, status
from rest_framework.decorators import detail_route
from rest_framework.response import Response 
from rest_framework.authtoken.models import Token

import common.utility as utilty

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

		new_manager_ids = request.data.get('managers', [])
		if len(new_manager_ids) == 0:
			print 'Cannot Update List with Empty Set of Managers'
			resp['error'] = 'Cannot Update List with Empty Set of Managers'
			return response.Response(resp)

		# Add New Managers 
		for mgr_id in new_manager_ids:
			manager = Manager.objects.filter(id = mgr_id).first()
			if not manager:
				raise Exception('Found Invalid Manager ID {}'.format(mgr_id))

			if mgr_id not in [a.id for a in manager_list.managers]:
				print 'Adding New Manager {} to Manager List {}'.format(mgr_id, id)
				manager_list.managers.append(manager)
		
		# Remove Managers Not in List
		to_remove = []
		for mgr in manager_list.managers:		
			if mgr.id not in new_manager_ids:
				print 'Removing Manager {} from Manager List {}'.format(mgr.id, id)
				to_remove.append(mgr.id)

		manager_list.managers = [mgr for mgr in manager_list.managers if mgr.id not in to_remove]
		manager_list.updatedAt = datetime.datetime.now()
		
		manager_list.save() # Maybe Dont Need to Save Here Too

		serial = ManagerListSerializer(manager_list)
		return response.Response(serial.data)

	def create(self, request):
		resp = {}

		name = request.data.get('name')
		if not name:
			resp['error'] = 'Must Provide List Name' # Should be Prevented in Front End
			return response.Response(resp)

		# Raise Exception? -> Should be Prevented in Front End
		managers = request.data.get('managers', [])
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
		resp = {}
		try:
			instance = self.get_object()
			if instance.user != request.user.id:
				raise Exception('Cannot Delete Query That Does Not Belong to Logged In User')
			self.perform_destroy(instance)

		except Http404:
			raise Exception('Object Does Not Exist')
		return response.Response(status=status.HTTP_204_NO_CONTENT)



