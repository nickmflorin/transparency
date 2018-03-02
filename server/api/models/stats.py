import sys
sys.dont_write_bytecode = True
from mongoengine import Document, EmbeddedDocument, fields

import datetime 
import time 

from scipy.stats import skew, kurtosis, norm, genpareto, linregress, pearsonr, scoreatpercentile
from numpy import *
import numpy as np
from math import sqrt, pi, e, fsum

from server.api import db
from server.api import utility

class LookbackReturns(EmbeddedDocument):
	lookback = fields.DictField()
	ytd = fields.FloatField(default = 0.0)

	@staticmethod
	def cumulative_return(indexed, months):
		today = datetime.date.today()
		dates = utility.dates.generate_lookback_end_of_month_dates(today, months)

		values = []
		for date in dates:
			ret = indexed.get(date)
			if ret:
				values.append(ret.value)
			else:
				values.append(0.0)

		total = utility.returns.calculate_total_return(values)
		return total

	@staticmethod
	def generate_ytd(indexed):
		dates = utility.dates.generate_end_of_month_dates_for_year()

		values = []
		for date in dates:
			ret = indexed.get(date)
			if ret:
				values.append(ret.value)
			else:
				values.append(0.0)
				
		total = utility.returns.calculate_total_return(values)
		return total

	# TO DO: In the future, if we are missing all dates in range we just want to have a null value for the cumulative return.
	# Only use 1.0 to Default if Missing Values but Not All Values
	@staticmethod
	def generate(returns):
		doc = LookbackReturns(lookback = {})
		returns.sort(key=lambda r: r.date, reverse=True) # Most Recent Dates First

		indexed = {}
		for ret in returns:
			indexed[ret.date.date()] = ret 

		months = [3, 6, 9, 12, 24, 36, 60]
		lookback = {}
		for mth in months:
			cum = LookbackReturns.cumulative_return(indexed, mth)
			doc.lookback[mth] = cum

		doc.ytd = LookbackReturns.generate_ytd(indexed)
		return doc 

class ReturnStats(Document):
	test = fields.FloatField(default=0.0, required=True)
	maximum = fields.FloatField(default=0.0, required=True)
	minimum = fields.FloatField(default=0.0, required=True)
	average = fields.FloatField(default=0.0, required=True)
	cumulative = fields.EmbeddedDocumentField(LookbackReturns)

	@staticmethod
	def generate(returns):
		stats = ReturnStats()
		
		if len(returns) != 0:
			stats.test = 100
			stats.maximum = max([ret.value for ret in returns])
			stats.minimum = min([ret.value for ret in returns])
			stats.average = sum([ret.value for ret in returns])/len(returns)

			stats.cumulative = LookbackReturns.generate(returns)
		return stats
