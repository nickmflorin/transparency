import sys
sys.dont_write_bytecode = True

from rest_framework import serializers, response, filters, viewsets
from rest_framework_mongoengine.serializers import DocumentSerializer, EmbeddedDocumentSerializer

from models import TransparencyUser

class UserSerializer(serializers.Serializer):	
	_id = serializers.UUIDField()
	username = serializers.CharField()
	email = serializers.EmailField()
	class Meta:
		model = TransparencyUser
		fields = ('_id','username','email')