import sys
sys.dont_write_bytecode = True

from rest_framework import serializers, response, filters, viewsets
from rest_framework.renderers import JSONRenderer
from rest_framework_mongoengine.serializers import EmbeddedDocumentSerializer, DocumentSerializer

from server.api.models import manager, strategy, returns, ReturnStats

class ReturnStatsSerializer(DocumentSerializer):	
	class Meta:
		model = ReturnStats
		fields = '__all__'

class SimpleReturnsSerializer(DocumentSerializer):
	stats = serializers.SerializerMethodField('stats_generator')

	def stats_generator(self, model):
		print model
		stats = ReturnStats.generate(model.series)
		serializer = ReturnStatsSerializer(stats).data
		return serializer

	class Meta:
		model = returns.ManagerReturns
		fields = '__all__'

class ReturnsSerializer(SimpleReturnsSerializer):
	yearly = serializers.SerializerMethodField('yearly_generator')

	# To Do: Figure Out How to Serialize Individual Returns Automatically After They Are Broken Down Into Year Buckets
	# We Cannot Recursively Use Models Without Converting to Dicts Because Models Are Not JSON Serializable and Serializers Arent Used at This Stage
	def yearly_generator(self, model):
		yearly = {}
		for ret in model.series:
			if not yearly.get(ret.date.year):
				yearly[ret.date.year] = returns.ManagerReturns(series = [])
			yearly[ret.date.year].series.append(ret)

		final = {}
		for year, model in yearly.items():
			final[year] = SimpleReturnsSerializer(model).data

		return final

	
