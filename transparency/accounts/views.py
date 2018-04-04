import sys
sys.dont_write_bytecode = True
import json
import jwt
from rest_framework import views
from django.views import View
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
	InvalidPassword = {'message' : 'The Password Provided is Incorrect', 'field' : 'password'}
	NotProvided = {'message' : "Please Valid Username/Password", 'field' : 'both'}
	UsernameDoesNotExist = {'message' : "The Provided Username Does Not Exist", 'field' : 'username'} 

class Login(View):
	permission_classes = (AllowAny,)

	def post(self, request, *args, **kwargs):
		response = {}
		print 'Logging User In'

		username =  request.POST.get('username')
		password =  request.POST.get('password')

		if not username and not password:
			print Errors.NotProvided
			response['error'] = Errors.NotProvided
			return JsonResponse(response)
		
		user = authenticate(username = username, password = password)
		if not user:
			user_with_username = TransparencyUser.objects.filter(username = username).first()

			if not user_with_username:
				print Errors.UsernameDoesNotExist
				response['error'] = Errors.UsernameDoesNotExist
			else:
				print Errors.InvalidPassword
				response['error'] = Errors.InvalidPassword
			return JsonResponse(response)

		login(request, user)

		response['user'] = UserSerializer(user).data 
		response['token'] = jwt.encode({'id': response['user']['id'], 'email': user.email}, "SECRET_KEY")
		
		return JsonResponse(response)

class Logout(views.APIView):
	permission_classes = (AllowAny,)

	def get(self, request, *args, **kwargs):
		user = request.user 
		if not user: 
			raise Exception('User Already Logged Out')

		logout(request)
		return Response({'success' : True}, status=200, content_type="application/json")


