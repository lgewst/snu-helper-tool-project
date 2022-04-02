from django.urls import include, path
from rest_framework.routers import SimpleRouter
from tree.views import TreeViewSet

app_name = 'tree'

router = SimpleRouter()
router.register('tree', TreeViewSet, basename='tree')  # /tree/

urlpatterns = [
    path('', include((router.urls))),
]
