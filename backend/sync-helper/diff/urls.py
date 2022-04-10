from django.urls import include, path
from rest_framework.routers import SimpleRouter
from diff.views import DiffViewSet

app_name = 'diff'

router = SimpleRouter()
router.register('diff', DiffViewSet, basename='diff')  # /diff/

urlpatterns = [
    path('', include((router.urls))),
]
