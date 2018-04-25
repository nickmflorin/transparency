# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.apps import AppConfig
from django.core.management.base import BaseCommand 

from config.models import ManagerGroup 

class Command(BaseCommand):
	def add_arguments(self, parser):
		parser.add_argument('command', nargs='+', type=str)

	def handle(self, *args, **options):
		commands = options['command']

		direct = {
			'groups' : self.groups, 
		}

		if direct.get(commands[0]) is None:
			print 'Invalid Command {}'.format(commands[0])
			return 

		direct[commands[0]](options)
		return 

	def groups(self, options):
		ManagerGroup.update()
		return

