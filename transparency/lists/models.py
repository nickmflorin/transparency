import sys
sys.dont_write_bytecode = True
import datetime 
import time 
from underscore import _
import unicodedata

from mongoengine import Document, EmbeddedDocument, ReferenceField, fields
from transparency.managers.models import Manager
from transparency.accounts.models import TransparencyUser

class ManagerList(Document):
	user_id = fields.UUIDField(required = True)
	createdAt = fields.DateTimeField(required = True)
	name = fields.StringField(required=True)
	# IMPORTANT -> Want to Prevent Automatic Querying of Manager Exposures/Returns on Reference to Not Bog Down
	managers = fields.ListField(fields.ReferenceField(Manager))

	meta = {
		'collection' : 'lists',
		'indexes': [
			{'fields': ['$name', "$user_id"]}
		]
	}
	def __str__(self):
		return '%s Created by %s w/ %s Managers' % (self.name, self.user_id, len(self.managers))