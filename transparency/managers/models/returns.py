import sys
sys.dont_write_bytecode = True
import time
import datetime 
from underscore import _
import numpy as np 
import pandas as pd 
import math
from scipy.stats import skew, kurtosis, norm, genpareto, linregress, pearsonr, scoreatpercentile

from mongoengine import Document, EmbeddedDocument, fields
import pymongo

import transparency.db as db
import transparency.utility as utility 

from process import ManagerReturnResult
from transparency.config.models import Range 

class ManagerReturn(EmbeddedDocument):
	date = fields.DateTimeField(required = True)
	value = fields.FloatField(required=True)

	def __str__(self):
		string = self.date.strftime("%Y-%m-%d")
		return 'Return %s on %s' % (self.value, string)

	@staticmethod
	def from_result(result):
		result = ManagerReturnResult(result)
		ret = ManagerReturn(date = result.date, value = result.value)
		return ret

class CumReturn(EmbeddedDocument):
	value = fields.FloatField(default = 0.0) 
	months = fields.IntField(required = True)
	range = fields.EmbeddedDocumentField(Range)
	series = fields.ListField(fields.EmbeddedDocumentField(ManagerReturn))
	
	@staticmethod 
	def create(returns, range_, months):
		mini_range = range_.at_lookback(months)
		cum = CumReturn(months = months, range = mini_range)
		
		cum_returns = returns.slice(mini_range, fill_zeros = True)

		cum.series = cum_returns.series 
		cum.value = cum_returns.total()
		return cum

class ManagerReturns(EmbeddedDocument):
	series = fields.ListField(fields.EmbeddedDocumentField(ManagerReturn))
	range = fields.EmbeddedDocumentField(Range)
	complete_range = fields.EmbeddedDocumentField(Range)

	@property
	def basic_range(self):
		return Range(start = self.start, end = self.end)

	@property 
	def end(self):
		if len(self.series) != 0:
			return max([a.date for a in self.series])
		return None 

	@property 
	def start(self):
		if len(self.series) != 0:
			return min([a.date for a in self.series])
		return None 

	# Range Must be Valid -> To Do: Maybe Use .create_range so Valid Range Ensured Around Series?
	def total(self):
		values = self.values(absolute = False)
		ret = 1.0
		for val in values:
			ret = val * ret
		return 100.0 * (ret - 1.0)

	def values(self, range_ = None, absolute = True):
		if not range_:
			series = self.series[:]
		else:
			returns = self.slice(range_)
			series = returns.series[:]
		
		series.sort(key=lambda r: r.date)
		if absolute:
			return [float(a.value) for a in series]
		else:
			return [1.0 + float(a.value)/100.0 for a in series]

	# Performs Linear Regression of Returns Over Specified Dates
	def linregress(self, returns, dates = None, manager = None, other = None):
		beta, intercept, r_value, p_value, stderr = 0.0, 0.0, 0.0, 0.0, 0.0

		# If Not Pruning -> Need to Match Returns Since Dates Might Not Correspond
		if dates:
			range_ = Range(start = min(dates), end = max(dates))
			primary = self.slice(range_, fill_zeros = True)
			secondary = returns.slice(range_, fill_zeros = True)
		else:
			primary, secondary = ManagerReturns.match(self, returns)

		if len(primary.series) != len(secondary.series):
			raise Exception('Primary and Secondary Series Should be of Same Length and Same Length as Dates')
		if dates:
			 if len(primary.series) != len(dates) or len(secondary.series) != len(dates):
			 	raise Exception('Primary and Secondary Series Should be of Same Length and Same Length as Dates')

		if len(primary.series) != 0 and len(secondary.series) != 0:
			primary.series.sort(key=lambda r: r.date)
			secondary.series.sort(key=lambda r: r.date)

			primary_returns = np.array([ret.value for ret in primary.series])
			secondary_returns = np.array([ret.value for ret in secondary.series])

			beta, intercept, r_value, p_value, stderr = linregress(primary_returns, secondary_returns)
			beta = float(beta)

			try: 
				beta = float(beta)
			except:
				num_months = 'all'
				if dates: 
					num_months = len(dates)
				print 'Warning: Found Invalid Beta Value for Num Months {}'.format(num_months)
				beta = 0.0

		return beta, intercept, r_value, p_value, stderr 

	@staticmethod 
	def match(primary, secondary):
		primary_dates = [a.date for a in primary.series]
		secondary_dates = [a.date for a in secondary.series]
		shared = utility.dates.intersect(primary_dates, secondary_dates)

		range_ = Range(start = min(shared), end = max(shared))

		# Shouldnt Need to Fill Zeros
		primary = primary.slice(range_, fill_zeros = False)
		secondary = secondary.slice(range_, fill_zeros = False)
		return primary, secondary

	# Finds Returns In Series That Have Date in the Date List and Creates New List Corresponding to Dates
	# If Dates Are Missing and Fill Zeros is True, Fills In Zero Return Values for Missing Dates
	def slice(self, range_, fill_zeros = False):
		
		new = ManagerReturns(series = [], range = Range(start = self.start, end = self.end))
		new.range.restrict(range_)

		# Empty Range Means That Range Was Outside of Returns Range
		if new.range.empty:
			return new 

		if not new.range.start or not new.range.end:
			raise Exception('Cannot Slice Return Stream with Empty Range')

		for ret in self.series:
			if new.range.around_date(ret.date):
				new.series.append(ret)

		if len(new.series) != 0:
			new.range.start = min([a.date for a in new.series])
			new.range.end = max([a.date for a in new.series])

			if fill_zeros:
				complete = new.range.get_month_series(start_add_in = new.range.start, end_add_in = new.range.end)
				for comp in complete:
					if comp not in [a.date for a in new.series]:
						ret = ManagerReturn(value = 0.0, date = comp)
						new.series.append(ret)

		new.series.sort(key=lambda r: r.date)
		return new

	


