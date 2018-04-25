import sys
sys.dont_write_bytecode = True
from mongoengine import Document, EmbeddedDocument, fields

from pymongo import UpdateOne, InsertOne, DeleteMany
from pymongo.errors import BulkWriteError
import pandas as pd 

from config import ManagerGroupConfig

# To Do: Maybe Created a Created by and At Field so Users Can Create Custom Groups?
# Maybe Incoprorate This Similiarly to Manager Lists?
class ManagerGroup(Document):
	id = fields.StringField(primary_key = True, required=True)
	name = fields.StringField(required=True)
	desc = fields.StringField(required=True)
	managers = fields.ListField(fields.ReferenceField('Manager'))
	
	meta = {
		'collection' : 'groups',
		'indexes': [
			{'fields': ['id', 'name'], 'unique': True },
		],
	}

	@staticmethod
	def update():
		print 'Clearing Previous Manager Groups...'
		ManagerGroup.objects.delete()

		for group in ManagerGroupConfig.groups:
			if len(group['managers']) == 0:
				raise Exception('Cannot Save Empty Group')

			new = ManagerGroup(id = group['id'], name = group['name'], desc = group['desc'], managers = [])

			for manager in group['managers']:
				model = Manager.objects.filter(id = manager).first()
				if not model:
					raise Exception('Group {} Contained Invalid Manager {}'.format(group['id'], manager))

				new.managers.append(model)

			print 'Inserting New Group {} Containing {} Managers'.format(group['id'], len(group['managers']))
			new.save()
		return
