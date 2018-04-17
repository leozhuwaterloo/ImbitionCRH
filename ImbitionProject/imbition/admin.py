from django.contrib import admin
from imbition.models import Permission, PermissionGroup, Employee

# Register your models here.
admin.site.register(Permission)
admin.site.register(PermissionGroup)
admin.site.register(Employee)
