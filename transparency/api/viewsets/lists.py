import sys
sys.dont_write_bytecode = True
import datetime 
from django.http import HttpResponse

from rest_framework import response, filters, viewsets
from rest_framework.decorators import detail_route
from rest_framework.response import Response 
from rest_framework.authtoken.models import Token

import transparency.api.serializers as serialize
from transparency.api.models import ManagerList, Manager

import json

class ManagerListViewSet(viewsets.ModelViewSet):
	lookup_field = 'id'
	queryset = ManagerList.objects.all()

	def get_serializer_class(self):
		if self.action == 'retrieve':
			return serialize.lists.ManagerListDetailSerializer
		return serialize.lists.ManagerListSerializer

	# Forces Refresh
	def get_queryset(self):
		queryset = self.queryset.all()
		return queryset

	def create(self, request):
		resp = {}

		ids = request.POST.get('ids')
		name = request.POST.get('name')
		if not name or not ids:
			raise Exception('Must Provide Managers and Name')

		ids = json.loads(ids)
		ids = [ int(x) for x in ids ]

		if not request.user.is_authenticated():
			raise Exception('Only Logged in Users Can Create Lists')

		# Only Error That Should Not Have Been Automatically Prevented Ahead of Time
		mgrlist = ManagerList.objects.filter(name = name).first()
		if mgrlist:
			print 'Error : Manager List Name Already Exists'
			resp['error'] = 'Manager List Name Already Exists'
			return response.Response(resp)
	
		newlist = ManagerList(name = name, createdAt = datetime.datetime.now(), managers = [], user_id = request.user._id)
		for id in ids:
			manager = Manager.objects.filter(id = id).first()
			if not manager:
				raise Exception('Found Invalid Manager ID {}'.format(id))
			newlist.managers.append(manager)
			newlist.save()
			
		created = ManagerList.objects.filter(id = newlist.id).first()
		serial = serialize.lists.ManagerListSerializer(created)
		return response.Response(serial.data)

	def destroy(self, request, *args, **kwargs):
		instance = self.get_object()
		self.get_serializer().destroy(instance)
		print("Instance destroyed!")
		return response.Response(status=status.HTTP_204_NO_CONTENT)


