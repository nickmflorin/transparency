# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.apps import AppConfig
from django.core.management.base import BaseCommand 

from apps.accounts.models import TransparencyApp 

class Command(BaseCommand):
	def handle(self, *args, **options):
		TransparencyApp.update()
		return 
