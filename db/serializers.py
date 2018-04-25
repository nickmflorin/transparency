import sys
sys.dont_write_bytecode = True

from rest_framework import serializers, response, filters, viewsets
from rest_framework_mongoengine.serializers import DocumentSerializer, EmbeddedDocumentSerializer

from models import DatabaseTable, Database, QueryResults, SavedQuery
from accounts.serializers import UserSerializer
from accounts.models import TransparencyUser

class SavedQuerySerializer(DocumentSerializer):	
	user = serializers.SerializerMethodField()

	# This Will Cause Issues If We Delete User ACcounts
	def get_user(self, model):
		userModel = TransparencyUser.objects.filter(id = model.user).first()
		if not userModel:
			raise Exception('Saved Query Was Not Created with Valid User')
		serial = UserSerializer(userModel)
		return serial.data

	class Meta:
		model = SavedQuery
		fields = '__all__'

class DatabaseTableSerializer(DocumentSerializer):	
	class Meta:
		model = DatabaseTable
		fields = '__all__'

class QueryResultsSerializer(DocumentSerializer):
	class Meta:
		model = QueryResults
		fields = '__all__'

class DatabaseSerializer(DocumentSerializer):
	class Meta:
		model = Database
		fields = '__all__'
		depth = 1

