import sys
sys.dont_write_bytecode = True
import datetime 

from rest_framework import response, filters, viewsets
from ..serializers import ManagerGroupSerializer
from ..models import ManagerGroup

class ManagerGroupViewSet(viewsets.ModelViewSet):
	lookup_field = 'id'
	queryset = ManagerGroup.objects.all()
	serializer_class = ManagerGroupSerializer

	def destroy(self, request, *args, **kwargs):
		instance = self.get_object()
		self.get_serializer().destroy(instance)
		print("Instance destroyed!")
		return response.Response(status=status.HTTP_204_NO_CONTENT)
