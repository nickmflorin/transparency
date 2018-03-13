from __future__ import unicode_literals
from django.apps import AppConfig

import datetime
import random 
from transparency.api.models import ManagerList, Manager

# Insert Any Fixtures Here
class ApiConfig(AppConfig):
    name = 'api'

    @staticmethod
    def startup():
        return
    	ManagerList.objects.delete()

    	fakeManagerLists = [
    		{'name' : 'Fake List 1', 'createdAt' : datetime.datetime.today(), 'user_id' : 'nickmflorin', 'managers' : []},
    		{'name' : 'Fake List 2', 'createdAt' : datetime.datetime.today(), 'user_id' : 'bobao', 'managers' : []},
    		{'name' : 'Fake List 3', 'createdAt' : datetime.datetime.today(), 'user_id' : 'ronnie', 'managers' : []},
    		{'name' : 'Fake List 4', 'createdAt' : datetime.datetime.today(), 'user_id' : 'haley', 'managers' : []}
    	]

    	managers = Manager.objects.limit(100).all()
    	for i in range(len(fakeManagerLists)):
	    	for j in range(10):
	    		rand = random.choice(managers)
	    		if rand.id not in fakeManagerLists[i]['managers']:
	    			fakeManagerLists[i]['managers'].append(rand)
	    			
	    	model = ManagerList(**fakeManagerLists[i])
	    	model.save()
    	return

