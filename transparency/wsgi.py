import sys
sys.dont_write_bytecode = True

import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "transparency.settings")
application = get_wsgi_application()
