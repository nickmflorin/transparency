import sys
sys.dont_write_bytecode = True

from rest_framework import serializers, response, filters, viewsets
from rest_framework.renderers import JSONRenderer
from rest_framework_mongoengine.serializers import EmbeddedDocumentSerializer, DocumentSerializer

from ..models.exposure import ManagerExposure, ManagerExposures

class ExposureSerializer(DocumentSerializer):
	id = serializers.SerializerMethodField()

	# Explicitly Include Fields to Exclude Original DB Id of Exposure and Replace with Manager ID
	class Meta:
		model = ManagerExposure
		fields = ('id','date','value','tier')

	def get_id(self, model):
		return model.manager_id

class ExposuresSerializer(DocumentSerializer):
	id = serializers.SerializerMethodField()
	exposures = serializers.ListField(
	   child=ExposureSerializer()
	)

	class Meta:
		model = ManagerExposures
		fields = ('id','exposures')

	def get_id(self, model):
		id = self.context.get('id')
		if not id:
			raise Exception('Must Provide ID Context')
		return id

