# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.apps import AppConfig
from django.core.management.base import BaseCommand, CommandError
from django.apps import apps

from transparency.api.models import Manager

class Command(BaseCommand):
	help = "Reindex the manager model."    

	def add_arguments(self, parser):
		parser.add_argument('model', nargs='+', type=str)

	def handle(self, *args, **options):
		saved_ct = 0     
		print "Starting reindex. This may take a few minutes..." 
		for o in Manager.objects.all(): 
			o.save()
			saved_ct += 1
			print 'Saved {}'.format(saved_ct)

