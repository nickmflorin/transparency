import sys
sys.dont_write_bytecode = True
import json
import jwt
from rest_framework import views
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from django.shortcuts import render_to_response
from django.http import HttpResponse, JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages

from rest_framework.authtoken.models import Token
from models import TransparencyUser 
from serializers import UserSerializer

class Errors:
	InvalidLogin = 'Invalid Username/Password'
	NotProvided = "Please Valid Username/Password"

class Login(views.APIView):
	permission_classes = (AllowAny,)

	def post(self, request, *args, **kwargs):
		response = {}
		print 'Logging User In'

		if not request.data:
			print Errors.NotProvided
			response['error'] = Errors.NotProvided
			return Response(response, status=400, content_type="application/json")
		
		username = request.data['username']
		password = request.data['password']

		user = authenticate(username = username, password = password)
		if not user:
			print Errors.InvalidLogin
			response['error'] = Errors.InvalidLogin
			return Response(response, status=400, content_type="application/json")

		login(request, user)

		response['user'] = UserSerializer(user).data 
		response['token'] = jwt.encode({'id': response['user']['_id'], 'email': user.email}, "SECRET_KEY")
		
		return Response(response, status=200, content_type="application/json")

class Logout(views.APIView):
	permission_classes = (AllowAny,)

	def get(self, request, *args, **kwargs):
		user = request.user 
		if not user: 
			raise Exception('User Already Logged Out')

		logout(request)
		return Response({'success' : True}, status=200, content_type="application/json")


