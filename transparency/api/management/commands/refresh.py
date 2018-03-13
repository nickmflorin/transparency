# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.apps import AppConfig
from django.core.management.base import BaseCommand 

from transparency.api.models import manager, peers, benchmarks, returns, tables, strategy, exposure

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
		}

		if direct.get(commands[0]) is None:
			print 'Invalid Command {}'.format(commands[0])
			return 

		direct[commands[0]](options)
		return 

	def strategies(self, options):
		strategy.Strategy.refresh()
		strategy.SubStrategy.refresh()
		return

	def benchmarks(self, options):
		benchmarks.ManagerBenchmarks.refresh()
		return

	def peers(self, options):
		peers.ManagerPeers.refresh()
		return

	def managers(self, options):
		manager.Manager.refresh()
		return

	def tables(self, options):
		tables.Database.refresh()
		return