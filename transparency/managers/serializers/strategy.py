import sys
sys.dont_write_bytecode = True

from rest_framework import serializers, response, filters, viewsets
from rest_framework_mongoengine.serializers import DocumentSerializer, EmbeddedDocumentSerializer

from ..models import Manager, Strategy

class StrategySerializer(DocumentSerializer):
	class Meta:
		model = Strategy
		fields = '__all__'