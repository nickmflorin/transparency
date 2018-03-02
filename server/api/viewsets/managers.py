import sys
sys.dont_write_bytecode = True

from rest_framework import response, filters, viewsets
from rest_framework.decorators import detail_route

import server.api.serializers as serialize
from server.api.models import Manager

class ManagerViewSet(viewsets.ModelViewSet):
	lookup_field = 'id'
	search_fields = ['id','name']

	def get_serializer_class(self):
		search = self.request.GET.get('search')
		if search:
			return serialize.manager.ManagerSearchSerializer
		return serialize.manager.ManagerSerializer # I dont' know what you want for create/destroy/update.

	def get_queryset(self):
		"""
		This view should return a list of all the managers
		for the current request parameters.
		"""
		search = self.request.GET.get('search')
		id = self.request.GET.get('id')

		if search:
			if search is str and search.strip() == "":
				return []
			return Manager.objects.search_text(search).all()[0:20]

		elif id:
			id = int(id)
			return Manager.objects.filter(id = id).all()

		return Manager.objects.all()

	def destroy(self, request, *args, **kwargs):
		instance = self.get_object()
		self.get_serializer().destroy(instance)
		print("Instance destroyed!")
		return response.Response(status=status.HTTP_204_NO_CONTENT)
