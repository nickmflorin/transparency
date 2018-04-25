import sys
sys.dont_write_bytecode = True

from rest_framework import viewsets
from serializers import *
from models import TransparencyApp

class TransparencyAppViewSet(viewsets.ReadOnlyModelViewSet):
	lookup_field = 'id'
	serializer_class = TransparencyAppSerializer

	def get_queryset(self, request):
		return TransparencyApp.objects.filter(level=1).all()