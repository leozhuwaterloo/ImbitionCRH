from django.contrib import admin
from imbition.models import Permission, Department, Employee, Position, RecordField, Record, PendingEmployee

# Register your models here.
admin.site.register(Permission)
admin.site.register(Department)
admin.site.register(Employee)
admin.site.register(Position)
admin.site.register(RecordField)
admin.site.register(Record)
admin.site.register(PendingEmployee)
