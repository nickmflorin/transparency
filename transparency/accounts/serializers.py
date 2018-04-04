import sys
sys.dont_write_bytecode = True

from rest_framework import serializers, response, filters, viewsets
from rest_framework_mongoengine.serializers import DocumentSerializer, EmbeddedDocumentSerializer

from models import TransparencyUser

class UserSerializer(serializers.Serializer):	
	id = serializers.IntegerField()
	username = serializers.CharField()
	email = serializers.EmailField()
	first_name = serializers.CharField(max_length=200)
	last_name = serializers.CharField(max_length=200)

	class Meta:
		model = TransparencyUser
		fields = ('id','username','email','first_name','last_name')

