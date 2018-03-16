import sys
sys.dont_write_bytecode = True
import datetime 
import time 
import numpy as np 
from scipy.stats import skew, kurtosis, norm, genpareto, linregress, pearsonr, scoreatpercentile

from underscore import _
import unicodedata

from mongoengine import Document, EmbeddedDocument, ReferenceField, fields
import pymongo

from manager import Manager 
from range import Range
import transparency.utility as utility
from metrics import BetaSet

class ManagerGroupReference(EmbeddedDocument):
	manager = fields.ReferenceField(Manager)
	desc = fields.StringField(required = False) # To Do: Include Allowable Fields
	betas = fields.EmbeddedDocumentField(BetaSet)

	# Calculates Metrics Comparing Group Manager to Primary Manager Passed In
	def calculate(self, manager, _range):
		self.betas = BetaSet.generate(self.manager, manager, _range)
		return

# Single Manager Compared to Set of Managers
class ManagerGroup(EmbeddedDocument):
	manager = fields.ReferenceField(Manager)
	references = fields.ListField(fields.EmbeddedDocumentField(ManagerGroupReference)) 
	range = fields.EmbeddedDocumentField(Range)

	def calculate(self):
		if not self.manager:
			raise Exception('Cannot Compare Until Primary Manager Specified')

		for reference in self.references:
			reference.calculate(self.manager, self.range)
		return

	def group(self, managers, include_benchmarks = True, include_peers = True):
		for manager in managers:
			self.create_reference(manager, calculate = False, desc = None )

		# Might Have to Ignore Duplicate Errors Here Since We Are Passing In Peers and Becnhmarks Additionally
		if include_peers and self.manager.peers:
			for peer in self.manager.peers:
				self.create_reference(peer, desc="peer", calculate = False)

		# Might Have to Ignore Duplicate Errors Here Since We Are Passing In Peers and Becnhmarks Additionally
		if include_benchmarks and self.manager.benchmarks:
			for benchmark in self.manager.benchmarks:
				self.create_reference(benchmark, desc="benchmark", calculate = False)

		self.calculate()
		return

	@staticmethod 
	def create(manager, managers, range_, include_benchmarks = True, include_peers = True):
		group = ManagerGroup(manager = manager, range = range_, references = [])
		group.group(managers, include_benchmarks = include_benchmarks, include_peers = include_peers)
		return group 

	def create_reference(self, manager, calculate = True, desc = None):
		if not self.manager:
			raise Exception('Cannot Add References Until Primary Manager Specified')

		# This Might Happen if Using Peer or Benchmark Descrption
		if manager.id in [a.manager.id for a in self.references]:
			if desc == 'peer' or desc == 'benchmark':
				print 'Warning: Trying to Add Peer and/or Benchmark That Already Exists in Group'
				return
			else:
				raise Exception('Manager Already Provided as Reference')

		reference = ManagerGroupReference(manager = manager, desc = desc)
		self.references.append(reference)

		# To Do: Maybe only calculate this once after all references added at the end
		if calculate:
			self.calculate()
		return

# Group Created as List of Manager IDs That Want Relative Stats
# General ManagerGroupSet Contains All Managers Relative to Each Other - i.e. Relative to Every Other Manager in Group
class ManagerGroupSet(EmbeddedDocument):
	managers = fields.ListField(fields.ReferenceField(Manager))
	groups = fields.ListField(fields.EmbeddedDocumentField(ManagerGroup))

	def __str__(self):
		return 'Manager Group : %s' % (str([mgr for mgr in self.managers]))

	@staticmethod 
	def group(managers, include_benchmarks = True, include_peers = True):

		group_set = ManagerGroupSet(managers = managers, groups = [])
		for manager in managers:
			group = ManagerGroup(manager = manager, references = [])

			unique = [mgr if mgr.id != manager.id else None for mgr in managers]
			unique = filter(lambda x : x != None, unique)

			group.group(unique, include_benchmarks = include_benchmarks, include_peers = include_peers)
			group_set.groups.append(group)

		return group_set 











	

