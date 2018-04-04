import sys
sys.dont_write_bytecode = True

from rest_framework import serializers, response, filters, viewsets
from rest_framework_mongoengine.serializers import DocumentSerializer, EmbeddedDocumentSerializer

from models import Range

class RangeSerializer(serializers.Serializer):
	start = serializers.DateTimeField(required = False)
	end = serializers.DateTimeField(required = False)
	class Meta:
		model = Range
		fields = '__all__'