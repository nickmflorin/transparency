import sys
sys.dont_write_bytecode = True

from rest_framework import serializers, response, filters, viewsets
from rest_framework.renderers import JSONRenderer
from rest_framework_mongoengine.serializers import EmbeddedDocumentSerializer

from transparency.api.models import exposure

class ExposureSerializer(EmbeddedDocumentSerializer):
	class Meta:
		model = exposure.ManagerExposure
		fields = '__all__'

	
