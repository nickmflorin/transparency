import sys
sys.dont_write_bytecode = True
import datetime 

from rest_framework import serializers, response, filters, viewsets
from rest_framework_mongoengine.serializers import EmbeddedDocumentSerializer, DocumentSerializer

from ..models import Range
import transparency.utility as utility 

class RangeSerializer(serializers.Serializer):
	start = serializers.DateTimeField(required = False)
	end = serializers.DateTimeField(required = False)
	date = serializers.DateTimeField(required = False)

	class Meta:
		model = Range
		fields = '__all__'