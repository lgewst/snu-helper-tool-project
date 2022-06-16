from django.urls import include, path
from rest_framework.routers import SimpleRouter
from author.views import AuthorViewSet

app_name = 'author'

router = SimpleRouter()
router.register('author', AuthorViewSet, basename='author')  # /author/

urlpatterns = [
    path('', include((router.urls))),
]
