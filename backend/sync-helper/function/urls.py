from django.urls import include, path
from rest_framework.routers import SimpleRouter
from function.views import FunctionViewSet

app_name = 'functions'

router = SimpleRouter()
router.register('functions', FunctionViewSet, basename='functions')  # /functions/

urlpatterns = [
    path('', include((router.urls))),
]
