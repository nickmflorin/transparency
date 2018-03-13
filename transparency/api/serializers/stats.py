import sys
sys.dont_write_bytecode = True
from underscore import _ 
from scipy.stats import skew, kurtosis, norm, genpareto, linregress, pearsonr, scoreatpercentile
from numpy import *
import numpy as np
from math import sqrt, pi, e, fsum
import math 

import time
import datetime 
from underscore import _

from mongoengine import Document, EmbeddedDocument, fields
import pymongo
from rest_framework import serializers, response, filters, viewsets
from rest_framework.renderers import JSONRenderer
from rest_framework_mongoengine.serializers import EmbeddedDocumentSerializer, DocumentSerializer

from transparency.api import db, utility
from transparency.api.models import returns 

class Utility:
	@staticmethod
	def calculate_total_return(values):
		ret = 1.0

		values = [1.0 + float(a)/100.0 for a in values]
		for val in values:
			ret = val * ret
		ret = ret - 1.0
		return 100.0 * ret

	@staticmethod
	def values_over_dates(series, dates):
		values = []

		def findInSeries(other, series):
			for mgr_return in series:
				return_date = mgr_return.date
				if return_date.month == other.month and return_date.year == other.year:
					return mgr_return 
			return None 

		for date in dates:
			ret = findInSeries(date, series)
			if ret:
				values.append(ret.value)
			else:
				values.append(0.0)
		return values 

class CumulativeReturns(EmbeddedDocument):

	month_3 = fields.FloatField(required=True, default=0.0)
	month_6 = fields.FloatField(required=True, default=0.0)
	month_9 = fields.FloatField(required=True, default=0.0)
	year_1 = fields.FloatField(required=True, default=0.0)
	year_2 = fields.FloatField(required=True, default=0.0)
	year_3 = fields.FloatField(required=True, default=0.0)
	year_5 = fields.FloatField(required=True, default=0.0)

	__relation__ = {
		3 : 'month_3',
		6 : 'month_6',
		9 : 'month_9',
		12 : 'year_1',
		24 : 'year_2',
		36 : 'year_3',
		60 : 'year_5',
	}
	def assign(self, month, value):
		name = CumulativeReturns.__relation__.get(month)
		if not name:
			raise Exception('Invalid Cumulative Return Month {}'.format(month))
		setattr(self, name, value)
		return

	# Takes Return Series, Number of Months to Look Back, and Date to Look Back From as Input
	# and Calculates Cumulative Return Over This Period
	# To Do: Do We Want to Use End of Listed Month (i.e. Today in Some Cases) or End of Last Month Where Returns Might be Available
	@staticmethod
	def calculate_cum_return(series, months, end):
		end = utility.dates.last_day_of_month(end.month, end.year)
		dates = utility.dates.generate_lookback_end_of_month_dates(end, months)

		values = Utility.values_over_dates(series, dates)
		total = Utility.calculate_total_return(values)
		return total

	@staticmethod
	def create(series, _range):
		cumulative = CumulativeReturns()

		if not _range.outside and len(series) != 0:
			if not _range.end:
				raise Exception('Range Must Have Valid End Date')

			for month, name in CumulativeReturns.__relation__.items():
				value = CumulativeReturns.calculate_cum_return(series, month, _range.end)
				cumulative.assign(month, value)
			
		return cumulative 

class ReturnStats(EmbeddedDocument):

	#date_range = serializers.SerializerMethodField()
	maximum = fields.FloatField(required=True, default=0.0)
	minimum = fields.FloatField(required=True, default=0.0)
	average = fields.FloatField(required=True, default=0.0)
	ytd = fields.FloatField(required=True, default=0.0)
	std_dev_annual = fields.FloatField(required=True, default=0.0)
	var = fields.FloatField(required=True, default=0.0)
	max_drawdown = fields.FloatField(required=True, default=0.0)
	extreme_shortfall = fields.FloatField(required=True, default=0.0)
	skew = fields.FloatField(required=True, default=0.0)

	cumulative = fields.EmbeddedDocumentField(CumulativeReturns)

	@staticmethod 
	def create(series, _range):
		# To Do: Make Date Range a Field of Return States
		model = ReturnStats()

		series = series 
		series.sort(key=lambda d : d.date)
		model.calculate(series, _range)
		return model

	def calculate(self, series, _range):

		self.maximum = self.maximum_(series)
		self.average = self.average_(series)
		self.minimum = self.minimum_(series)
		self.std_dev_annual = self.std_dev_annual_(series)
		self.var = self.var_(series)
		self.max_drawdown = self.max_drawdown_(series)
		self.extreme_shortfall = self.extreme_shortfall_(series)
		self.skew = self.skew_(series)
		self.ytd = self.ytd_(series)

		# Range Needed for Cumulative to Ensure End Date is At As Of Date of Range
		self.cumulative = CumulativeReturns.create(series, _range)
		return

	def ytd_(self, series):
		values = [float(a.value) for a in series]
		dates = utility.dates.generate_end_of_month_dates_for_year()

		values = Utility.values_over_dates(series, dates)		
		total = Utility.calculate_total_return(values)
		return total

	def maximum_(self, series):
		values = [float(a.value) for a in series]

		value = 0.0
		if len(values) != 0:
			value = max(values)
		return value

	def minimum_(self, series):
		values = [float(a.value) for a in series]

		value = 0.0
		if len(values) != 0:
			value = min(values)
		return value

	def average_(self, series):
		values = [float(a.value) for a in series]

		value = 0.0
		if len(values) != 0:
			value = sum(values) / float(len(values))
		return value

	def skew_(self, series):
		values = [float(a.value) for a in series]

		value = 0.0
		values = values 
		if len(values) == 0:
			return value

		value = skew(values, bias=False)
		return value

	# To Do: This does not seem right what so ever.
	# Do not know why haley was doing this in this way
	def extreme_shortfall_(self, series, confidence=0.95):
		values = [float(a.value) for a in series]

		value = 0.0
		values = values 
		if len(values) == 0:
			return value

		factors = {0.95:-2.06, 0.99:-2.66}
		array = np.array(values)
		cVAR = array.std(None, None, None, 1) * factors[confidence]

		if math.isnan(cVAR):
			print 'Warning: Found NAN cVAR'
			return 0.0
		return cVAR

	def max_drawdown_(self, series):
		values = [float(a.value) for a in series]

		value = 0.0
		values = values 
		if len(values) == 0:
			return value

		localMax, localMin = 1.0, 1.0
		MaxDrawDown = 0.0

		for ret in values:
			if ret > localMax:
				localMax, localMin = ret, ret
			elif ret < localMin:
				localMin = ret

			if (localMin-localMax)/localMax < MaxDrawDown:
				MaxDrawDown = (localMin-localMax)/localMax
		return MaxDrawDown

	# Should Also Double Check This
	def var_(self, series, confidence=0.95):
		values = [float(a.value) for a in series]

		value = 0.0
		if len(values) == 0:
			return value

		if len(values) != 0.0:
			factor = norm.ppf(confidence)
			array = np.array(values)
			var = array.std(None,None,None,1) * factor

			if math.isnan(var):
				print 'Warning: Found NAN VAR'
				return 0.0

		return var 

	def std_dev_annual_(self, series):
		values = [float(a.value) for a in series]

		value = 0.0
		if len(values) == 0:
			return value

		stddev = np.std(values) * np.sqrt(12.0)
		return stddev

