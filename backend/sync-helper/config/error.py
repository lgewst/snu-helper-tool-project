from django.core.exceptions import PermissionDenied
from django.http import Http404
from rest_framework import exceptions
from rest_framework.exceptions import APIException
from rest_framework.response import Response
from rest_framework.views import exception_handler, set_rollback

class CustomResponse(Response):
    def __init__(self, data=None, status=None, template_name=None, headers=None, exception=False, content_type=None,
                 message=None):
        super().__init__(data, status, template_name, headers, exception, content_type)
        # custom field error_code, message
        self.message = message

def custom_exception_handler(exc, context):
    # Call REST framework's default exception handler first,
    # to get the standard error response.
    if isinstance(exc, Http404):
        exc = exceptions.NotFound()
    elif isinstance(exc, PermissionDenied):
        exc = exceptions.PermissionDenied()

    if isinstance(exc, exceptions.APIException):
        headers = {}
        if getattr(exc, 'auth_header', None):
            headers['WWW-Authenticate'] = exc.auth_header
        if getattr(exc, 'wait', None):
            headers['Retry-After'] = '%d' % exc.wait

        if isinstance(exc.detail, (list, dict)):
            data = exc.detail
        else:
            data = {'detail': exc.detail}

        set_rollback()
        if isinstance(exc, SyncHelperException):
            response = CustomResponse(data, status=exc.status_code, headers=headers, message=exc.message)
            response.data['status_code'] = response.status_code
            response.data['message'] = response.message
            response.data['detail'] = "SyncHelper Custom Error"
            return response
        else:
            return Response(data, status=exc.status_code, headers=headers)

    return None

class SyncHelperException(APIException):
    message = ""

class InitializeException(SyncHelperException):
    status_code = 400
    message = "Initialize repositories and version first"

class InvalidPathException(SyncHelperException):
    status_code = 400
    message = "Invalid path"
