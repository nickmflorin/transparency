import sys
sys.dont_write_bytecode = True
from rest_framework import response, filters, viewsets

import server.api.serializers as serialize
from server.api.models import DatabaseTable, Database, QueryResults

class DatabaseQueryResultsViewSet(viewsets.ModelViewSet):
	lookup_field = 'id'
	serializer_class = serialize.tables.DatabaseQueryResultsSerializer

	def get_queryset(self):
		print 'Getting Query Set'

		sql = self.request.GET.get('sql')
		id = self.request.GET.get('id')
		if sql:
			results = QueryResults(sql = sql)
			results.retrieve(limit = True)
			return [results]

		elif id:
			table = DatabaseTable.objects.filter(id = id).first()
			if not table:
				raise Exception('Invalid Table ID')
			results =  table.queryTop5() # Results Are DatabaseQueryResult Object
			return [results] # Must be Passed As List for Query Set

		else:
			raise Exception('Must Provide SQL or Method')
		
	def destroy(self, request, *args, **kwargs):
		instance = self.get_object()
		self.get_serializer().destroy(instance)
		print("Instance destroyed!")
		return response.Response(status=status.HTTP_204_NO_CONTENT)

class DatabaseViewSet(viewsets.ModelViewSet):
	lookup_field = 'id'
	serializer_class = serialize.tables.DatabaseSerializer

	def get_queryset(self):
		id = self.request.GET.get('id')
		if id:
			return Database.objects.filter(id = id).all()
		return Database.objects.all()

	def destroy(self, request, *args, **kwargs):
		instance = self.get_object()
		self.get_serializer().destroy(instance)
		print("Instance destroyed!")
		return response.Response(status=status.HTTP_204_NO_CONTENT)
