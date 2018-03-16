import sys
sys.dont_write_bytecode = True

from rest_framework import serializers, response, filters, viewsets
from rest_framework.renderers import JSONRenderer
from rest_framework_mongoengine.serializers import EmbeddedDocumentSerializer

from ...models import BetaSet

class BetaSetSerializer(EmbeddedDocumentSerializer):
	class Meta:
		model = BetaSet
		fields = '__all__'

	

