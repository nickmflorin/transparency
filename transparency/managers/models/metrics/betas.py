import sys
sys.dont_write_bytecode = True
import datetime 
import time 
import numpy as np 
from scipy.stats import skew, kurtosis, norm, genpareto, linregress, pearsonr, scoreatpercentile

from mongoengine import Document, EmbeddedDocument, ReferenceField, fields
import transparency.utility as utility
from ..range import Range 

class BetaSet(EmbeddedDocument):
	total = fields.FloatField(default = 0.0) 
	range = fields.EmbeddedDocumentField(Range)

	primary = fields.IntField(required = True)
	secondary = fields.IntField(required = True)

	year_1 = fields.FloatField(default = 0.0) 
	year_2 = fields.FloatField(default = 0.0) 
	year_3 = fields.FloatField(default = 0.0) 
	year_4 = fields.FloatField(default = 0.0) 
	year_5 = fields.FloatField(default = 0.0) 
	year_10 = fields.FloatField(default = 0.0) 
	
	__cumyears__ = [12,24,36,48,60,120]
	__cumyears_map__ = ['year_1','year_2','year_3','year_4','year_5','year_10']

	@staticmethod
	def generate_over_horizon(manager, other, horizon = None):
		dates = [ret.date for ret in manager.returns.series]
		other_dates = [ret.date for ret in other.returns.series]

		shared = utility.dates.intersect(dates, other_dates) # Shared Dates
		if horizon != None:
			shared = utility.dates.intersect(shared, horizon) # Shared Dates Over Horizon

		shared.sort()

		primary = manager.returns.prune_(shared)
		secondary = other.returns.prune_(shared)

		if len(primary) != len(secondary):
			raise Exception('Return Series Should be of Equal Length After Prune')
		
		beta = 0.0
		if len(primary) != 0 and len(secondary) != 0:
	
			primary_returns = np.array([ret.value for ret in primary])
			secondary_returns = np.array([ret.value for ret in secondary])
			beta, intercept, r_value, p_value, stderr = linregress(secondary_returns, primary_returns)

		return beta

	@staticmethod
	def generate(manager, other, range_):
		first_date = min([ret.date for ret in manager.returns.series] + [ret.date for ret in other.returns.series])
		last_date = max([ret.date for ret in manager.returns.series] + [ret.date for ret in other.returns.series])

		new_range = Range(start = first_date, end = last_date)
		new_range.validate()

		new_range.restrict(range_) # Restrict to Desired Date Range of Interest

		# Temporarily Using Start Date as Today -> Going to Need to Incorporate Start Date from Request
		betaSet = BetaSet(range = new_range, primary = manager.id, secondary = other.id)
		betaSet.total = BetaSet.generate_over_horizon(manager, other, horizon = None)

		for i in range(len(BetaSet.__cumyears__)):
			num_months = BetaSet.__cumyears__[i]
			dates = utility.dates.generate_lookback_end_of_month_dates(new_range.end, num_months)
			attr = BetaSet.__cumyears_map__[i]

			beta = BetaSet.generate_over_horizon(manager, other, dates)
			setattr(betaSet, attr, beta)

		return betaSet

	