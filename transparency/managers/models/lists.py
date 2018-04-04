import sys
sys.dont_write_bytecode = True
import datetime 
import time 
from underscore import _
import unicodedata
import uuid 

from mongoengine import Document, EmbeddedDocument, ReferenceField, fields
from transparency.accounts.models import TransparencyUser

from manager import Manager

class ManagerList(Document):
	user = fields.IntField(required=True)
	createdAt = fields.DateTimeField(required = True)
	name = fields.StringField(required=True)
	managers = fields.ListField(fields.ReferenceField(Manager))

	meta = {
		'collection' : 'lists',
		'indexes': [
			{'fields': ['name'], 'unique': True },
		]
	}
	def __str__(self):
		return '%s Created by %s w/ %s Managers' % (self.name, self.user, len(self.managers))