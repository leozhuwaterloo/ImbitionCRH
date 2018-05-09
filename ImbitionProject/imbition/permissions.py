from rest_framework import permissions
from imbition.models import Permission
from django.core.exceptions import PermissionDenied

def admin_only(func):
    def call_if_admin(self, request, *args, **kwargs):
        if not request.user or not request.user.is_staff:
            raise PermissionDenied()
        return func(self, request, *args, **kwargs)
    return call_if_admin

def get_children(position):
    children = set()
    for child in position.children.all():
        children.add(child)
    for child in position.children.all():
        for sub_child in get_children(child):
            children.add(sub_child)
    return children

def get_readable(position):
    readable = get_children(position)
    for permission in position.permissions.all():
        readable.add(permission.position)
    return readable

def get_changable(position):
    changable = get_children(position)
    for permission in position.permissions.all():
        if permission.permission == Permission.PERMISSION_CHANGE:
            changable.add(permission.position)
    return changable
