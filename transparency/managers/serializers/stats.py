import sys
sys.dont_write_bytecode = True
import datetime 
import pandas as pd 

from scipy.stats import skew, kurtosis, norm, genpareto, linregress, pearsonr, scoreatpercentile
from numpy import *
import numpy as np
from math import sqrt, pi, e, fsum
import math 

from rest_framework import serializers, response, filters, viewsets
from rest_framework.renderers import JSONRenderer
from rest_framework_mongoengine.serializers import EmbeddedDocumentSerializer, DocumentSerializer

from transparency.config.models import Range 
from transparency.config.serializers import RangeSerializer
import transparency.utility as utility

from ..models import ManagerReturns, ManagerReturn, CumReturn, Manager, Strategy, ReturnStats

class CumReturnSerializer(EmbeddedDocumentSerializer):
	range = RangeSerializer()
	#series = SingleReturnSerializer(many = True)

	class Meta:
		model = CumReturn
		fields = '__all__'

class ReturnStatsSerializer(EmbeddedDocumentSerializer):

	total = serializers.SerializerMethodField()
	maximum = serializers.SerializerMethodField()
	minimum = serializers.SerializerMethodField()
	average = serializers.SerializerMethodField()
	ytd = serializers.SerializerMethodField()
	std_dev_annual = serializers.SerializerMethodField()
	var = serializers.SerializerMethodField()
	max_drawdown = serializers.SerializerMethodField()
	extreme_shortfall = serializers.SerializerMethodField()
	skew = serializers.SerializerMethodField()

	cumulative = serializers.SerializerMethodField()
	range = serializers.SerializerMethodField()

	class Meta:
		model = ReturnStats
		fields = '__all__'

	# Range Missing -> Means it Wasn't Specified... Error
	# Range Invalid -> [None, None] -> Means Return Series Has No Returns... No Error, Just Return
	def validate(self, model):
		returns = self.context.get('returns')
		if not returns:
			raise Exception('Must Provide Returns in Context')

		range_ = self.context.get('range')
		if not range_:
			raise Exception('Must Provide Range in Context')

		if not range_.valid:
			print 'Cannot Calculate Return Stats... Empty Series'
			return False
		return True 

	# Incorporates Range Start and End Dates From Request
	def get_range(self, model):
		range_ = self.context.get('range')
		serial = RangeSerializer(range_)
		return serial.data 

	def get_cumulative(self, model):
		valid = self.validate(model)
		if valid:
			returns = self.context.get('returns')
			range_ = self.context.get('range')
		
			cumulative = []
			for months in ReturnStats.__cum_months__:
				cum = CumReturn.create(returns, range_, months)
				cumulative.append(cum)

			serial = CumReturnSerializer(cumulative, many = True)
			return serial.data

	def get_ytd(self, model):
		valid = self.validate(model)
		if valid:
			returns = self.context.get('returns')
			range_ = self.context.get('range')
		
			range_ = Range.ytd_range() # Uses Current Year if None Provided

			returns = returns.slice(range_, fill_zeros = True)
			ytd = returns.total()
			return ytd

	def get_total(self, model):
		valid = self.validate(model)
		if valid:
			returns = self.context.get('returns')
			total = returns.total()
			return total

	def get_maximum(self, model):
		valid = self.validate(model)

		if valid:
			returns = self.context.get('returns')
			values = returns.values()

			if len(values) != 0:
				maximum = max(values)
				return maximum

	def get_minimum(self, model):
		valid = self.validate(model)
		if valid:
			returns = self.context.get('returns')
			values = returns.values()

			if len(values) != 0:
				minimum = min(values)
				return minimum

	def get_average(self, model):
		valid = self.validate(model)
		if valid:
			returns = self.context.get('returns')
			values = returns.values()

			if len(values) != 0:
				average = sum(values) / float(len(values))
				return average

	def get_skew(self, model):
		valid = self.validate(model)
		if valid:
			returns = self.context.get('returns')
			values = returns.values()
			if len(values) != 0:
				skew_value = skew(values, bias=False)
				return skew_value

	# To Do: This does not seem right what so ever... Do not know why haley was doing this in this way
	def get_extreme_shortfall(self, model, confidence=0.95):
		valid = self.validate(model)
		if valid:
			returns = self.context.get('returns')
			values = returns.values()
			if len(values) != 0:
				factors = {0.95:-2.06, 0.99:-2.66}

				array = np.array(values)
				extreme_shortfall = array.std(None, None, None, 1) * factors[confidence]

				if math.isnan(extreme_shortfall):
					print 'Warning: Found NAN cVAR'
					return 0.0

				return extreme_shortfall

	def get_max_drawdown(self, model):
		valid = self.validate(model)
		if valid:
			returns = self.context.get('returns')
			values = returns.values()
			if len(values) != 0:
				localMax, localMin = 1.0, 1.0
				max_drawdown = 0.0

				for ret in values:
					if ret > localMax:
						localMax, localMin = ret, ret
					elif ret < localMin:
						localMin = ret

					if (localMin-localMax)/localMax < max_drawdown:
						max_drawdown = (localMin-localMax)/localMax

				return max_drawdown

	def get_var(self, model, confidence=0.95):
		valid = self.validate(model)
		if valid:
			returns = self.context.get('returns')
			values = returns.values()
			if len(values) != 0:

				factor = norm.ppf(confidence)
				array = np.array(values)
				var = array.std(None,None,None,1) * factor

				if math.isnan(var):
					print 'Warning: Found NAN VAR'
					return 0.0

				return var 

	def get_std_dev_annual(self, model):
		valid = self.validate(model)
		if valid:
			returns = self.context.get('returns')
			values = returns.values()
			if len(values) != 0:
				std_dev_annual = np.std(values) * np.sqrt(12.0)
				return std_dev_annual
