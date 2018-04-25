import sys
sys.dont_write_bytecode = True

from rest_framework import serializers, response, filters, viewsets
from rest_framework_mongoengine.serializers import DocumentSerializer, EmbeddedDocumentSerializer

from models import TransparencyUser, TransparencyApp

class TransparencyAppSerializer(serializers.Serializer):	
	id = serializers.CharField()
	label = serializers.CharField()
	path_name = serializers.CharField()
	order = serializers.IntegerField()
	level = serializers.IntegerField()
	children = serializers.SerializerMethodField()
	live = serializers.BooleanField()
	deprecated = serializers.BooleanField()

	class Meta:
		model = TransparencyApp
		fields = ('id','label','name','children','level','live','deprecated')

	# Since ManyToMany Field Will Also Have Highest Level Child Having Children, To Avoid Infinite
	# Recursion, We Filter by the Level Being 1 More Than Base Model Level... Simpler Fix Would be Incorporating
	# Foreign Key with Parent Instead of Children but This Method in Model is More Intuitive
	def get_children(self, model):
		children = model.children.filter(level = model.level + 1).all()
		return TransparencyAppSerializer(children, many=True).data
		
class UserSerializer(serializers.Serializer):	
	id = serializers.IntegerField()
	username = serializers.CharField()
	email = serializers.EmailField()
	first_name = serializers.CharField(max_length=200)
	last_name = serializers.CharField(max_length=200)
	apps = serializers.SerializerMethodField()

	def get_apps(self, model):
		apps = model.apps.all()
		serial = TransparencyAppSerializer(apps, many = True)
		return serial.data

	class Meta:
		model = TransparencyUser
		fields = ('id','username','email','first_name','last_name', 'apps')

