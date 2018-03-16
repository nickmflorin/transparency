from .settings import *
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

STATIC_ROOT='/assets'
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, "client"),
]
print 'Dires'
print STATICFILES_DIRS

WEBPACK_LOADER = {
    'DEFAULT': {
            'BUNDLE_DIR_NAME': '/bundles',
            'STATS_FILE': os.path.join(BASE_DIR, 'webpack-stats.prod.json'),
        }
}

