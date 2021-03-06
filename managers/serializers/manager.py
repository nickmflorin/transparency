import sys
sys.dont_write_bytecode = True
import json

from rest_framework import serializers, response, filters, viewsets
from rest_framework_mongoengine.serializers import DocumentSerializer, EmbeddedDocumentSerializer

from returns import SimpleReturnsSerializer
from ..models import Manager, Strategy

class ManagerSimpleSerializer(DocumentSerializer):
	
	class Meta:
		model = Manager
		fields = ('id','name')

# MongoEngine Automatically Specifies Nested Object Serializers So We Dont Need to Create These
class ManagerSerializer(DocumentSerializer):
	returns = SimpleReturnsSerializer()
	peers = ManagerSimpleSerializer(many = True)
	benchmarks = ManagerSimpleSerializer(many = True)

	class Meta:
		model = Manager
		fields = ('id','returns','strategy','substrategy','name','peers','benchmarks')
		depth = 1

	