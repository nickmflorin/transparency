import sys
sys.dont_write_bytecode = True
import json
import math

from rest_framework import serializers, response, filters, viewsets
from rest_framework_mongoengine.serializers import DocumentSerializer, EmbeddedDocumentSerializer

import common.utility as utility
from common.models import Range 
from common.serializers import RangeSerializer 

from manager import ManagerSimpleSerializer
from ..models import ManagerBeta, ManagerBetaSet, ManagerBetas, Manager

class ManagerSimpleSerializer(DocumentSerializer):
	class Meta:
		model = Manager
		fields = ('id','name')

class ManagerBetaSerializer(EmbeddedDocumentSerializer):
	value = serializers.SerializerMethodField()
	months = serializers.IntegerField()
	range = RangeSerializer()
	
	class Meta:
		model = ManagerBeta
		fields = ('value','months','range')

	def get_value(self, model):
		beta = 0.0

		if model.manager and model.to:

			mini_range = model.range.at_lookback(model.months)
			series = mini_range.get_month_series()

			beta, _, _, _, _ = model.manager.returns.linregress(model.to.returns, dates = series)
			if math.isnan(beta):
				print 'Warning: Found NAN Value for Beta Between {} and {} - {} Months'.format(model.manager.id, model.to.id, model.months)
				beta = 0.0

		return beta

class ManagerBetaSetSerializer(EmbeddedDocumentSerializer):
	to = ManagerSimpleSerializer()
	cumulative = serializers.SerializerMethodField()

	class Meta:
		model = ManagerBetaSet
		fields = ('to','cumulative')

	def get_cumulative(self, model):
		cumulative = []

		if model.manager and model.to and len(model.manager.returns.series) != 0 and len(model.to.returns.series):

			first_date = min([ret.date for ret in model.manager.returns.series] + [ret.date for ret in model.to.returns.series])
			last_date = max([ret.date for ret in model.manager.returns.series] + [ret.date for ret in model.to.returns.series])

			new_range = Range(start = first_date, end = last_date)
			new_range.validate()
			new_range.restrict(model.range) # Restrict to Desired Date Range of Interest

			for num_months in  ManagerBetaSet.__cumyears__:
				beta = ManagerBeta(months = num_months, range = new_range, manager = model.manager, to = model.to)
				cumulative.append(beta)

		serial = ManagerBetaSerializer(cumulative, many = True)
		print 'Finished Calculating Betas to Manager',model.to.name
		return serial.data

# Using PrimaryKeyRelatedField Not Working for Some Weird Reason
class ManagerBetasSerializer(EmbeddedDocumentSerializer):
	manager = serializers.PrimaryKeyRelatedField(read_only=True)
	managers = serializers.SerializerMethodField()
	groups = serializers.SerializerMethodField()
	betas = serializers.SerializerMethodField()
	range = RangeSerializer()

	class Meta:
		model = ManagerBetas
		fields = ('manager','managers','groups','betas','range')

	def get_managers(self, model):
		return [a.id for a in model.managers]

	def get_groups(self, model):
		return [a.id for a in model.groups]

	def get_betas(self, model):

		betas = []
		for group in model.groups:
			for manager in group.managers:
				beta = ManagerBetaSet(to = manager, desc = group.id, cumulative = [], range = model.range, manager = model.manager )
				betas.append(beta)

		for manager in model.managers:
			beta = ManagerBetaSet(to = manager, cumulative = [], range = model.range, manager = model.manager )
			betas.append(beta)

		serial = ManagerBetaSetSerializer(betas, many = True)
		return serial.data
