import sys
sys.dont_write_bytecode = True

from rest_framework import serializers, response, filters, viewsets
from rest_framework_mongoengine.serializers import DocumentSerializer, EmbeddedDocumentSerializer

from server.api.models import manager, strategy, returns, ReturnStats
from returns import ReturnsSerializer
from exposure import ExposureSerializer

class ManagerSearchSerializer(DocumentSerializer):	
	class Meta:
		model = manager.Manager
		fields = ['name','id']

# Not Including This is Causing Peers and Benchmarks to Not Have Strategy Object, Just Strategy ID, Dont Know Why
class StrategySerializer(DocumentSerializer):
	class Meta:
		model = strategy.Strategy
		fields = '__all__'

# Used for Peers and Benchmarks -> Doesnt Go Step Further of Finding Peers and Benchmarks for This Model
class ManagerLimitedSerializer(DocumentSerializer):
	returns = ReturnsSerializer()
	strategy = StrategySerializer() # Not Explicitly Including This is Causes Peers and Benchmarks to Not Have Strategy Object, Just Strategy ID, Dont Know Why
	class Meta:
		model = manager.Manager
		fields = ['returns','peers','benchmarks','strategy','substrategy','name','id']

# MongoEngine Automatically Specifies Nested Object Serializers So We Dont Need to Create These
# Unless They Have Specific ViewSet That Retrurns Only the Nested Objects
class ManagerSerializer(DocumentSerializer):
	returns = ReturnsSerializer()
	peers = ManagerLimitedSerializer(many=True, read_only=True)
	benchmarks = ManagerLimitedSerializer(many=True, read_only=True)

	class Meta:
		model = manager.Manager
		fields = ['returns','peers','benchmarks','strategy','substrategy','name','id']
		depth = 2

