import sys
sys.dont_write_bytecode = True

from rest_framework import serializers, response, filters, viewsets
from rest_framework_mongoengine.serializers import DocumentSerializer, EmbeddedDocumentSerializer

from transparency.api.models import lists
from manager import ManagerSerializer, ManagerSearchSerializer

class ManagerListSerializer(DocumentSerializer):	
	managers = ManagerSearchSerializer(many = True) # Need to Include Manager Return Calculations
	class Meta:
		model = lists.ManagerList
		fields = '__all__'

class ManagerListDetailSerializer(DocumentSerializer):	
	managers = ManagerSerializer(many = True) # Need to Include Manager Return Calculations
	class Meta:
		model = lists.ManagerList
		fields = '__all__'