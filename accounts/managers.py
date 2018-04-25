from __future__ import unicode_literals
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

class UserManager(BaseUserManager):
	# Creates and Saves a User With Username, Email and Password
	def create_user(self, username, email, first_name, last_name, password):
		if not email:
			raise ValueError('Users Must Have Email Addresses')
		if not first_name or not last_name:
			raise ValueError('Users Must Provide First and Last Names')
		if not password:
			raise ValueError('Users Must Provide Password')
		if not username:
			raise ValueError('Users Must Provide Username')

		user = self.model(
		    username = username,
		    first_name = first_name,
		    last_name = last_name,
		    email=self.normalize_email(email)
		)
		user.set_password(password)
		user.save(using=self._db)
		return user

	# Creates and Saves a Staff User 
	def create_staffuser(self, username, email, first_name, last_name, password):
		user = self.create_user(username, email, first_name, last_name, password)

		user.staff = True
		user.save(using=self._db)
		return user

	# Creates and Saves a Super User 
	def create_superuser(self, username, email, first_name, last_name, password):
		user = self.create_user(username, email, first_name, last_name, password)

		user.staff = True
		user.admin = True
		user.save(using=self._db)
		return user
