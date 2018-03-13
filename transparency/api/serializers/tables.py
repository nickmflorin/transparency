import sys
sys.dont_write_bytecode = True

from rest_framework import serializers, response, filters, viewsets
from rest_framework_mongoengine.serializers import DocumentSerializer, EmbeddedDocumentSerializer

from transparency.api.models import tables

class DatabaseTableSerializer(DocumentSerializer):	
	class Meta:
		model = tables.DatabaseTable
		fields = '__all__'

class DatabaseQueryResultsSerializer(DocumentSerializer):
	class Meta:
		model = tables.QueryResults
		fields = '__all__'

class DatabaseSerializer(DocumentSerializer):
	class Meta:
		model = tables.Database
		fields = '__all__'
		depth = 1

