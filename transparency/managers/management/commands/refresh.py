# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.apps import AppConfig
from django.core.management.base import BaseCommand 

from transparency.managers.models import Manager, ManagerPeers, ManagerBenchmarks, Strategy, ManagerReturns, SubStrategy, ManagerExposure
from transparency.db.models import DatabaseTable, Database

class Command(BaseCommand):
	def add_arguments(self, parser):
		parser.add_argument('command', nargs='+', type=str)

	def handle(self, *args, **options):
		commands = options['command']

		direct = {
			'managers' : self.managers, 
			'peers' : self.peers, 
			'benchmarks' : self.benchmarks,
			'strategies' : self.strategies, 
			'strategy' : self.strategies,
			'tables' : self.tables,
			'exposures' : self.exposures,
			'positions' : self.positions,
			'funds' : self.funds
		}

		if direct.get(commands[0]) is None:
			print 'Invalid Command {}'.format(commands[0])
			return 

		direct[commands[0]](options)
		return 

	def funds(self, options):
		#Fund.refresh()
		return

	def positions(self, options):
		ManagerPositions.refresh()
		return

	def strategies(self, options):
		Strategy.refresh()
		SubStrategy.refresh()
		return

	def benchmarks(self, options):
		ManagerBenchmarks.refresh()
		return

	def exposures(self, options):
		managers = manager.Manager.objects.all()
		ManagerExposure.refresh(managers = managers)
		return

	def peers(self, options):
		ManagerPeers.refresh()
		return

	def managers(self, options):
		Manager.refresh()
		return

	def tables(self, options):
		Database.refresh()
		return