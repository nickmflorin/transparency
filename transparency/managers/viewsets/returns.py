import sys
sys.dont_write_bytecode = True
import json 
import pymongo

from rest_framework import response, viewsets
from rest_framework.decorators import detail_route
from rest_framework import generics

from ..serializers import *
from ..models import ManagerReturns, Manager

class ManagerReturnViewSet(viewsets.ModelViewSet):
	lookup_field = 'id'
	serializer_class = ReturnsSerializer
	query_set = Manager.objects.all()

	def list(self, request):
		ids = utility.request.parse_list(request, 'managers', method = 'GET', default = None)
		if not ids:
			print 'Warning: Must Specify Manager IDs to Get List of Returns'
			return response.Response([])

		ids = [int(a) for a in ids]

		range_ = utility.request.parse_range(request)
		range_.validate()	

		if not range_.end:
			today = datetime.datetime.today()
			range_.end = utility.dates.last_day_of_month(date = today)

		managers = Manager.objects.filter(id__in = ids).only('returns').all()
		returns = [manager.returns for manager in managers]

		data = []
		for manager in managers:
			serial = ReturnsSerializer(manager.returns, context={'request': request, 'range' : range_, 'id' : manager.id})
			data.append(serial.data)
		return response.Response(data)

	def retrieve(self, request, id=None):
		if not id:
			raise Exception('Must Provide Primary Key for Returns Query')
		id = int(id)

		range_ = utility.request.parse_range(request)
		range_.validate()	

		# Have to Provide End Date of Range for Cumulative Lookback States... Use Today if Not Provided
		if not range_.end:
			today = datetime.datetime.today()
			range_.end = utility.dates.last_day_of_month(date = today)

		manager = Manager.objects.filter(id = id).only('returns').first()
		if not manager:
			raise Exception('Invalid Manager ID')

		serial = ReturnsSerializer(manager.returns, context={'request': request, 'range' : range_, 'id' : manager.id})
		return response.Response(serial.data)

	def destroy(self, request, *args, **kwargs):
		instance = self.get_object()
		self.get_serializer().destroy(instance)
		print("Instance destroyed!")
		return response.Response(status=status.HTTP_204_NO_CONTENT)
