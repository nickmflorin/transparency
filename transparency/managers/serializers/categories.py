import sys
sys.dont_write_bytecode = True

from rest_framework import serializers, response, filters, viewsets
from rest_framework.renderers import JSONRenderer
from rest_framework_mongoengine.serializers import EmbeddedDocumentSerializer, DocumentSerializer

from ..models.categories import ManagerCategoryExposure, ManagerCategoryExposures

class ExposureCategorySerializer(DocumentSerializer):
	id = serializers.SerializerMethodField()
	name = serializers.SerializerMethodField()

	# Explicitly Include Fields to Exclude Original DB Id of Exposure and Replace with Manager ID
	class Meta:
		model = ManagerCategoryExposure
		fields = ('id','date','value','tier','name','name_1','name_2','name_3','name_4','category')
		level_names_select = { 1 : 'name_1', 2 : 'name_2', 3 : 'name_3', 4 : 'name_4' }

	def to_representation(self, obj):
		# Get Original Representation
		ret = super(ExposureCategorySerializer, self).to_representation(obj)

		# Remove Fields Not Required Since They Are Shown in Parent Field
		if self.context.get('category'):
			ret.pop('category')

		if self.context.get('manager_id'):
			ret.pop('id')

		if self.context.get('level'):
			ret.pop('name_1')
			ret.pop('name_2')
			ret.pop('name_3')
			ret.pop('name_4')
		else:
			ret.pop('name')
			
		if self.context.get('tier'):
			ret.pop('tier')
		return ret 

	def get_name(self, model):
		level = self.context.get('level')
		if level:
			name = self.Meta.level_names_select.get(level)
			if not name:
				raise Exception('Invalid Level')
			return getattr(model, name)
		return

	def get_id(self, model):
		return model.manager_id

# Use Level, Category and Tier in Context
class ExposureCategoriesSerializer(DocumentSerializer):
	id = serializers.SerializerMethodField()
	exposures = ExposureCategorySerializer(many = True)
	level = serializers.SerializerMethodField()
	category = serializers.SerializerMethodField()
	tier = serializers.SerializerMethodField()

	class Meta:
		model = ManagerCategoryExposures
		fields = ('id','exposures','level','category','tier')

	def __init__(self, *args, **kwargs):
		context = kwargs.get('context')
		if not context:
			raise Exception('Contet Must be Provided for ExposureCategoriesSerializer')

		DocumentSerializer.__init__(self, *args, **kwargs)

	def to_representation(self, obj):
		# Get Original Representation
		ret = super(ExposureCategoriesSerializer, self).to_representation(obj)

		# Remove Fields Not Required
		if not self.context.get('category'):
			ret.pop('category')
		if not self.context.get('level'):
			ret.pop('level')
		if not self.context.get('tier'):
			ret.pop('tier')

		return ret 

	def get_id(self, model):
		id = self.context.get('manager_id')
		if not id:
			raise Exception('Must Provide Manager ID Context')
		return id

	def get_category(self, model):
		return self.context.get('category')

	def get_tier(self, model):
		return self.context.get('tier')

	def get_level(self, model):
		return self.context.get('level')

	