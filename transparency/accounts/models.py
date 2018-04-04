from __future__ import unicode_literals
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

import uuid 

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

class TransparencyUser(AbstractBaseUser):
	first_name = models.CharField(max_length = 40)
	last_name = models.CharField(max_length = 40)
	username = models.CharField(max_length = 20, unique = True)

	active = models.BooleanField(default=True)
	staff = models.BooleanField(default=False) # a admin user; non super-user
	admin = models.BooleanField(default=False) # a superuser
	
	email = models.EmailField(
		verbose_name='email address',
		max_length=255,
		unique=True,
	)

	objects = UserManager()
	
	USERNAME_FIELD = 'username'
	REQUIRED_FIELDS = ['first_name','last_name','email'] # Email & Password are required by default.

	# The user is identified by their username
	def get_full_name(self):
		return self.username

	def get_short_name(self):
		return self.first_name

	def __str__(self):              
		return self.username

	def has_perm(self, perm, obj=None):
		"Does the user have a specific permission?"
		# Simplest possible answer: Yes, always
		return True


	def has_module_perms(self, app_label):
		"Does the user have permissions to view the app `app_label`?"
		# Simplest possible answer: Yes, always
		return True

	@property
	def is_staff(self):
		"Is the user a member of staff?"
		return self.staff

	@property
	def is_admin(self):
		"Is the user a admin member?"
		return self.admin

	@property
	def is_active(self):
		"Is the user active?"
		return self.active