import sys
sys.dont_write_bytecode = True

from rest_framework import serializers, response, filters, viewsets
from rest_framework_mongoengine.serializers import DocumentSerializer, EmbeddedDocumentSerializer

from transparency.api.models import manager, strategy, returns
from returns import ReturnsSerializer
from exposure import ExposureSerializer

class ManagerSearchSerializer(DocumentSerializer):	
	class Meta:
		model = manager.Manager
		fields = ('id','name')
		
class StrategySerializer(DocumentSerializer):
	class Meta:
		model = strategy.Strategy
		fields = '__all__'

# MongoEngine Automatically Specifies Nested Object Serializers So We Dont Need to Create These
class ManagerSerializer(DocumentSerializer):
	returns = ReturnsSerializer()
	class Meta:
		model = manager.Manager
		fields = ('id','returns','strategy','substrategy','name')
		depth = 1

class ManagerExtendedSerializer(DocumentSerializer):
	returns = ReturnsSerializer()
	peers = ManagerSerializer(many=True, read_only=True)
	benchmarks = ManagerSerializer(many=True, read_only=True)

	class Meta:
		model = manager.Manager
		fields = ('id','returns','peers','benchmarks','strategy','substrategy','name')
		depth = 2