import sys
sys.dont_write_bytecode = True

import os
import mongoengine

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WSGI_APPLICATION = 'transparency.wsgi.application' 
ROOT_URLCONF = 'transparency.urls'

DEBUG = True
SERVER = False # Set to True When Running on Transparency Server

SECRET_KEY = '^zq-2!istmlc@0p1m@a$ko6cw4k8ii6%@ey=&-4$8$jeywava%'
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_L10N = True
USE_TZ = True
LOGIN_URL = '/login/'

ALLOWED_HOSTS = [
    'transparency', 
    '10.13.0.29', 
    'localhost',
    '127.0.0.1'
]

INSTALLED_APPS = [
    'common.apps.CommonConfig',
    'accounts.apps.AccountsConfig',
    'managers.apps.ManagersConfig',
    'db.apps.DBConfig',
    
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.auth',
    'django.contrib.admin',

    'webpack_loader',
    'rest_framework',
    'rest_framework_mongoengine',
    'rest_framework.authtoken',
    'corsheaders',
    'django_filters',
    'sass_processor',
]

# For Message Communication -> Right Now, No Method for Serializing Messages to Front End Instead of Using Template Variables
MESSAGE_STORAGE = 'django.contrib.messages.storage.cookie.CookieStorage'
AUTH_USER_MODEL = 'accounts.TransparencyUser'
mongoengine.connect(
    db="peers",
    host="localhost:27017"
)


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}

## Specify Webpack Loader Config to Allow Django Server to Server Webpack Files Instead of NPM Server
WEBPACK_LOADER = {
    'DEFAULT': {
            'BUNDLE_DIR_NAME': 'bundles/',
            'STATS_FILE': os.path.join(BASE_DIR, 'webpack-stats.dev.json'),
        }
}

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.common.CommonMiddleware',
]

CORS_ORIGIN_WHITELIST = (
    'localhost:8000',
    'localhost:5000',
    'localhost:3000',
    'localhost:3001',
)

CORS_ALLOW_HEADERS = (
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'X-CSRFToken',
    'x-csrftoken',
    'x-requested-with',
)

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR + '/templates/'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

STATIC_ROOT = BASE_DIR
SASS_PROCESSOR_ROOT = BASE_DIR
STATIC_URL = '/static/'
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, "static"),
]
STATICFILES_FINDERS = (
   'django.contrib.staticfiles.finders.FileSystemFinder',
   'django.contrib.staticfiles.finders.AppDirectoriesFinder',
   'sass_processor.finders.CssFinder',
)
SASS_PROCESSOR_INCLUDE_DIRS = [
    os.path.join(BASE_DIR, '/client/src/style'),
]

REST_FRAMEWORK = {
    'DEFAULT_FILTER_BACKENDS': ('rest_framework.filters.DjangoFilterBackend',),
}

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

