import sys
sys.dont_write_bytecode = True
import datetime 
from django.http import Http404, HttpResponse
import json 

from rest_framework.decorators import detail_route, list_route
from rest_framework import response, filters, viewsets, status
from serializers import *
from models import DatabaseTable, Database, QueryResults, SavedQuery

class QueriesViewSet(viewsets.ModelViewSet):
	lookup_field = 'id'
	queryset = SavedQuery.objects.all()
	serializer_class = SavedQuerySerializer

	@detail_route(methods=['get'])
	def run(self, request, id=None):
		if id == 'new':
			sql = request.GET.get('sql')
			if not sql:
				raise Exception('Must Provide SQL to Retrieve Results')
			query = SavedQuery(user = request.user.id, name = 'new', sql = sql)
		
		else:
			query = SavedQuery.objects.filter(id = id).first()
			if not query:
				raise Exception('Invalid Query ID')

			sql = request.GET.get('sql')
			if sql:
				query.sql = sql 
				
		limit = request.GET.get('limit')
		results = query.run(limit = limit)
		serial = QueryResultsSerializer(results)
		return response.Response(serial.data)

	# Forces Refresh
	def get_queryset(self):
		queryset = self.queryset.all()
		return queryset

	def update(self, request, id=None):
		resp = {}

		query = SavedQuery.objects.filter(id = id).first()
		if not query:
			raise Exception('Invalid Query ID')

		data = json.loads(request.body)
	
		sql = data.get('sql')
		if not sql or sql == "":
			raise Exception('Invalid SQL to Save')

		query.sql = sql 
		query.save()
		serial = SavedQuerySerializer(query)
		return response.Response(serial.data)

	def create(self, request):
		resp = {}

		sql = request.data.get('sql')
		if not sql or str(sql).strip() == "":
			resp['error'] = 'Query must contain valid SQL.'
			return response.Response(resp)

		name = request.data.get('name')
		if not name or str(name).strip() == "":
			resp['error'] = 'Query name must be valid.'
			return response.Response(resp)

		# Only Error That Should Not Have Been Automatically Prevented Ahead of Time
		query = SavedQuery.objects.filter(name = name).first()
		if query:
			print 'Error : Query Name Already Exists'
			resp['error'] = 'Query Name Already Exists'
			return response.Response(resp)
	
		newquery = SavedQuery(name = name, createdAt = datetime.datetime.now(), sql = sql, user = request.user.id)
		newquery.save()

		created = SavedQuery.objects.filter(id = newquery.id).first()
		serial = SavedQuerySerializer(created)
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

class DatabaseViewSet(viewsets.ReadOnlyModelViewSet):
	lookup_field = 'id'

	def get_serializer_class(self):
		id = self.request.GET.get('id')
		if id:
			return DatabaseTableSerializer
		return DatabaseSerializer
		
	def get_queryset(self):
		id = self.request.GET.get('id')
		if id:
			return Database.objects.filter(id = id).all()
		return Database.objects.all()


