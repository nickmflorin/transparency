from __future__ import unicode_literals
from django.apps import AppConfig

class ListConfig(AppConfig):
    name = 'lists'
    @staticmethod 
    def startup():
    	return