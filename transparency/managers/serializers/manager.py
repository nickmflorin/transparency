import sys
sys.dont_write_bytecode = True
import json

from rest_framework import serializers, response, filters, viewsets
from rest_framework_mongoengine.serializers import DocumentSerializer, EmbeddedDocumentSerializer

from ..models import Manager, Strategy, ManagerReturns, ManagerGroupReference, ManagerGroup, ManagerGroupSet, Range
from returns import ReturnsSerializer
from exposure import ExposureSerializer
from metrics import BetaSetSerializer
from range import RangeSerializer 

import transparency.utility as utility 

class ManagerSimpleSerializer(DocumentSerializer):
	class Meta:
		model = Manager
		fields = ('id','name')

# MongoEngine Automatically Specifies Nested Object Serializers So We Dont Need to Create These
class ManagerSerializer(DocumentSerializer):
	returns = ReturnsSerializer()
	group = serializers.SerializerMethodField()

	class Meta:
		model = Manager
		fields = ('id','returns','strategy','substrategy','name', 'group')
		depth = 1

	# To Do: Incorporate Start and End Dates as Well
	def get_group(self, model):
		range_ = Range(start = None, end = None)

		request = self.context.get('request')
		if request:
			range_ = Range.from_request(request)
			range_.validate()

			group_ids = request.query_params.get('group', None)

			if group_ids != None:
				group_ids = json.loads(group_ids)
				group_ids = [int(a) for a in group_ids]
				
				# Default to True Inside Model
				include_benchmarks = request.query_params.get('include_benchmarks', True)
				include_peers = request.query_params.get('include_peers', True)

				# Even if Group = [], Still Want Option to Include Peers & Benchmarks
				managers = Manager.objects.filter(id__in = group_ids).all()
				if len(managers) == 0 and not include_benchmarks and not include_peers:
					print 'Warning: No Valid Managers Supplied for Manager Group'
					return None
				
				group = ManagerGroup.create(model, managers, range_, include_benchmarks = include_benchmarks, include_peers = include_peers)
				serial = ManagerGroupSerializer(group)
				return serial.data

		return None

class ManagerGroupReferenceSerializer(EmbeddedDocumentSerializer):
	manager = ManagerSimpleSerializer()
	betas = BetaSetSerializer()
	desc = serializers.CharField(max_length = 4)

	class Meta:
		model = ManagerGroupReference
		fields = '__all__'

# Single Manager Compared to Set of Managers
class ManagerGroupSerializer(EmbeddedDocumentSerializer):
	manager = ManagerSimpleSerializer() # Using Normal Manager Serializer Will Casuse Infinite Recursion
	references = ManagerGroupReferenceSerializer(many=True, read_only=True)
	range = RangeSerializer()
	
	class Meta:
		model = ManagerGroup
		fields = '__all__'

class ManagerGroupSetSerializer(EmbeddedDocumentSerializer):
	managers = ManagerSimpleSerializer(many=True, read_only=True) # Using Normal Manager Serializer Will Casuse Infinite Recursion
	groups = ManagerGroupSerializer(many = True)

	class Meta:
		model = ManagerGroupSet
		fields = '__all__'
