from __future__ import unicode_literals
from django.apps import AppConfig

class DBConfig(AppConfig):
    name = 'db'
    @staticmethod 
    def startup():
    	return