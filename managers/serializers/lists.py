import sys
sys.dont_write_bytecode = True

from rest_framework import serializers, response, filters, viewsets
from rest_framework_mongoengine.serializers import DocumentSerializer, EmbeddedDocumentSerializer

from accounts.serializers import UserSerializer
from accounts.models import TransparencyUser

from ..models import ManagerList
from ..serializers import ManagerSerializer, ManagerSimpleSerializer

class ManagerListSerializer(DocumentSerializer):	
	user = serializers.SerializerMethodField()
	managers = ManagerSimpleSerializer(many = True) # Need to Include Manager Return Calculations

	class Meta:
		model = ManagerList
		fields = '__all__'

	def get_user(self, model):	

		user = TransparencyUser.objects.filter(id = model.user).first()
		if user:
			serial = UserSerializer(user)
			return serial.data
		return None 


class ManagerListDetailSerializer(DocumentSerializer):	
	user = serializers.SerializerMethodField()
	managers = ManagerSerializer(many = True) # Need to Include Manager Return Calculations

	class Meta:
		model = ManagerList
		fields = '__all__'

	def get_user(self, model):

		user = TransparencyUser.objects.filter(id = model.user).first()
		if user:
			serial = UserSerializer(user)
			return serial.data
		return None 