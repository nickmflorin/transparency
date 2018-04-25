import sys
sys.dont_write_bytecode = True
import json 
import pymongo

from rest_framework import response, viewsets
from rest_framework.decorators import detail_route
from rest_framework import generics

import common.utility as utility

from ..serializers import *
from ..models import ManagerCategoryExposure, ManagerCategoryExposures

import re

def create_exposure(model):
	exposure = ManagerCategoryExposure(
	    manager_id = model['manager_id'],
	    category = model["category"],
	    date = model["date"],
	    tier = model["tier"],
	    value = model["value"],
	    name_1 = model["name_1"],
	    name_2 = model["name_2"],
	    name_3 = model["name_3"],
	    name_4 = model["name_4"],
	)
	return exposure 

class ManagerCategoryExposureViewSet(viewsets.ModelViewSet):
	serializer_class = ExposureCategoriesSerializer
	lookup_field = 'manager_id'
	query_set = ManagerCategoryExposures.objects.all()
	level_names_select = { 1 : 'name_1', 2 : 'name_2', 3 : 'name_3', 4 : 'name_4' }

	def get_context(self, manager_id, request):
		if not manager_id:
			raise Exception('Must Provide Primary Key for Exposures Query')
		manager_id = int(manager_id)

		tier = request.GET.get('tier')
		level = request.GET.get('level')
		category = request.GET.get('category')

		query, context = { 'manager_id' : manager_id }, { 'manager_id' : manager_id }

		date = utility.request.parse_date(request) # Automatically Converts to EOMONTh
		if date:
			query['date'] = date 
		if tier:
			query['tier'] = str(tier)
			context['tier'] = str(tier)
		if category:
			query['category'] = str(category)
			context['category'] = str(category) 
		if level:
			level = int(level)
			context['level'] = level

			level_name = ManagerCategoryExposureViewSet.level_names_select.get(level)
			if not level_name:
				raise Exception('Invalid Level')
			query[level_name] = {'$ne' : None}

		return context, query

	# Using MongoDB Tends to be Mildly Faster for These Massive Queries
	def retrieve(self, request, manager_id=None):

		client = pymongo.MongoClient("localhost", 27017, maxPoolSize=50)
		db = client['peers']
		collection = db['categories']

		context, query = self.get_context(manager_id, request)
		
		models = list(collection.find(query))
		exposures = map(create_exposure, models)

		# Category Exposures Always in Array... Regardless of Whether or Not Date Supplied
		exposure = ManagerCategoryExposures(id = manager_id, exposures = exposures)
		serial = ExposureCategoriesSerializer(exposure, context=context)

		return response.Response(serial.data)

	def destroy(self, request, *args, **kwargs):
		instance = self.get_object()
		self.get_serializer().destroy(instance)
		print("Instance destroyed!")
		return response.Response(status=status.HTTP_204_NO_CONTENT)
