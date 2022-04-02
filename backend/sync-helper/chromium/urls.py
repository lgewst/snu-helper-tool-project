from django.urls import include, path
from rest_framework.routers import SimpleRouter
from chromium.views import ChromiumViewSet

app_name = 'chromium'

router = SimpleRouter()
router.register('chromium', ChromiumViewSet, basename='chromium')  # /chromium/

urlpatterns = [
    path('', include((router.urls))),
]
