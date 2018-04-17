from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, routers
from imbition import serializers
from imbition.models import Employee, Permission, PermissionGroup
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser

def index(request):
    return render(request, 'imbition/index.html')

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()

    def list(self, request, *args, **kwargs):
        response = super(EmployeeViewSet, self).list(request, *args, **kwargs)
        response.data = {"employees": response.data}
        return response
    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return serializers.EmployeeViewSerializer
        if self.action == 'create':
            return serializers.EmployeeCreateSerializer
        return serializers.EmployeeEditSerializer

class PermissionViewSet(viewsets.ModelViewSet):
    queryset = Permission.objects.all()
    serializer_class = serializers.PermissionSerializer
    permission_classes = (IsAdminUser, )
    def list(self, request, *args, **kwargs):
        response = super(PermissionViewSet, self).list(request, *args, **kwargs)
        response.data = {"permissions": response.data}
        return response

class PermissionGroupViewSet(viewsets.ModelViewSet):
    queryset = PermissionGroup.objects.all()
    permission_classes = (IsAdminUser, )
    def list(self, request, *args, **kwargs):
        response = super(PermissionGroupViewSet, self).list(request, *args, **kwargs)
        response.data = {"permissiongroups": response.data}
        return response
    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return serializers.PermissionGroupViewSerializer
        return serializers.PermissionGroupEditSerializer
