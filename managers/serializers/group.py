import sys
sys.dont_write_bytecode = True

from rest_framework import serializers, response, filters, viewsets
from rest_framework_mongoengine.serializers import DocumentSerializer, EmbeddedDocumentSerializer

from ..serializers import ManagerSimpleSerializer
from ..models import ManagerGroup 

class ManagerGroupSerializer(DocumentSerializer):	
	managers = ManagerSimpleSerializer(many = True)

	class Meta:
		model = ManagerGroup
		fields = '__all__'
