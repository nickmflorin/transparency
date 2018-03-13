from __future__ import unicode_literals
from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid 

class TransparencyUser(AbstractUser):
    _id = models.UUIDField(primary_key=True, default=uuid.uuid4)

   
