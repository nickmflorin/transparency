import sys
sys.dont_write_bytecode = True
import datetime 
import time 
import numpy as np 
import math
from scipy.stats import skew, kurtosis, norm, genpareto, linregress, pearsonr, scoreatpercentile

from mongoengine import Document, EmbeddedDocument, ReferenceField, fields
import transparency.utility as utility
from transparency.config.models import Range 

from manager import Manager
from group import ManagerGroup

class ManagerBeta(EmbeddedDocument):
	value = fields.FloatField(default = 0.0) 
	months = fields.IntField(required = True)
	range = fields.EmbeddedDocumentField(Range)
	manager = fields.ReferenceField('Manager')
	to = fields.ReferenceField('Manager')

class ManagerBetaSet(EmbeddedDocument):
	to = fields.ReferenceField(Manager)
	manager = fields.ReferenceField(Manager)
	range = fields.EmbeddedDocumentField(Range)
	desc = fields.StringField(required = False) # To Do: Include Allowable Fields
	cumulative = fields.ListField(fields.EmbeddedDocumentField(ManagerBeta))

	__cumyears__ = [24,36,48,60]

class ManagerBetas(Document):
	manager = fields.ReferenceField(Manager)
	managers = fields.ListField(fields.ReferenceField(Manager))
	groups = fields.ListField(fields.ReferenceField(ManagerGroup))
	betas = fields.ListField(fields.EmbeddedDocumentField(ManagerBeta))
	range = fields.EmbeddedDocumentField(Range)