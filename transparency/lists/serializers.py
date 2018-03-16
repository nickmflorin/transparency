import sys
sys.dont_write_bytecode = True

from rest_framework import serializers, response, filters, viewsets
from rest_framework_mongoengine.serializers import DocumentSerializer, EmbeddedDocumentSerializer

from models import ManagerList
from transparency.managers.serializers import ManagerSerializer, ManagerSimpleSerializer

class ManagerListSerializer(DocumentSerializer):	
	managers = ManagerSimpleSerializer(many = True) # Need to Include Manager Return Calculations
	class Meta:
		model = ManagerList
		fields = '__all__'

class ManagerListDetailSerializer(DocumentSerializer):	
	managers = ManagerSerializer(many = True) # Need to Include Manager Return Calculations
	class Meta:
		model = ManagerList
		fields = '__all__'