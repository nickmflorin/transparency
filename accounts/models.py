from __future__ import unicode_literals
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

import uuid 
from .config import AppLibrary
from .managers import UserManager 

class TransparencyApp(models.Model):
	id = models.CharField(primary_key = True, max_length = 40)
	label = models.CharField(unique = True, max_length = 40)
	path_name = models.CharField(unique = False, max_length = 40)
	order = models.IntegerField()
	level = models.IntegerField()

	children = models.ManyToManyField('self')
	live = models.BooleanField(default = True)
	deprecated = models.BooleanField(default = False)

	class Meta:
		app_label = 'accounts'
		verbose_name = 'App'

	def configure_children(self, config, level):
		if config.get('children', None):
			for i in range(len(config['children'])):
				child_conf = config['children'][i]
				child = TransparencyApp(id = child_conf['id'], path_name = child_conf['path_name'], label = child_conf['label'], order = i, level = level)
				child.save()

				self.children.add(child.id)
				self.save()

				print 'Adding Child {} to App {}'.format(child.id, self.id)
				child.configure_children(child_conf, level + 1)
		return 

	# Only Goes 3 Layers Deep for Now
	@staticmethod 
	def update():
		models = TransparencyApp.objects.all()
		for model in models:
			model.delete()

		# Add Parents First
		for i in range(len(AppLibrary)):
			conf = AppLibrary[i]
			app = TransparencyApp(id = conf['id'], path_name = conf['path_name'], label = conf['label'], order = i, level = 1)
			
			print 'Inserting App {}'.format(app.id)
			app.save()

			users = TransparencyUser.objects.filter(admin = True).all()
			for user in users:
				print 'Adding App {} to Admin {}'.format(app.id, user.username)
				user.apps.add(app)
				user.save()

			app.configure_children(conf, 2)

		return

class TransparencyUser(AbstractBaseUser):
	first_name = models.CharField(max_length = 40)
	last_name = models.CharField(max_length = 40)
	username = models.CharField(max_length = 20, unique = True)

	active = models.BooleanField(default=True)
	staff = models.BooleanField(default=False) # a admin user; non super-user
	admin = models.BooleanField(default=False) # a superuser
	apps = models.ManyToManyField('accounts.TransparencyApp')

	email = models.EmailField(
		verbose_name='email address',
		max_length=255,
		unique=True,
	)

	objects = UserManager()
	
	class Meta:
		app_label = 'accounts'
		verbose_name = 'Account'

	USERNAME_FIELD = 'username'
	REQUIRED_FIELDS = ['first_name','last_name','email','first_name','last_name'] # Email & Password are required by default.
	
	def get_apps(self):
		return self.apps.all()

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