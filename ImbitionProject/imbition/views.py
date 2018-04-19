from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, routers
from imbition import serializers
from imbition.models import Permission, Department, Position, Employee
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser


def index(request):
    return render(request, 'imbition/index.html')

class FourSerializerViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAdminUser, )
    def list(self, request, *args, **kwargs):
        response = super(FourSerializerViewSet, self).list(request, *args, **kwargs)
        response.data = {self.list_key: response.data}
        return response
    def get_serializer_class(self):
        if self.action == 'list':
            return self.list_serializer
        if self.action == 'retrieve':
            return self.detail_serializer
        if self.action == 'create':
            return self.create_serializer
        return self.update_serializer


class PermissionViewSet(FourSerializerViewSet):
    list_key = 'permissions'
    list_serializer = serializers.PermissionListSerializer
    detail_serializer = serializers.PermissionDetailSerializer
    create_serializer = serializers.PermissionEditSerializer
    update_serializer = serializers.PermissionEditSerializer
    queryset = Permission.objects.all()

class DepartmentViewSet(FourSerializerViewSet):
    list_key = 'departments'
    list_serializer = serializers.DepartmentListAndEditSerializer
    detail_serializer = serializers.DepartmentDetailSerializer
    create_serializer = serializers.DepartmentListAndEditSerializer
    update_serializer = serializers.DepartmentListAndEditSerializer
    queryset = Department.objects.all()

class PositionViewSet(FourSerializerViewSet):
    list_key = 'positions'
    list_serializer = serializers.PositionListSerializer
    detail_serializer = serializers.PositionDetailSerializer
    create_serializer = serializers.PositionEditSerializer
    update_serializer = serializers.PositionEditSerializer
    queryset = Position.objects.all()

class EmployeeViewSet(FourSerializerViewSet):
    list_key = 'employees'
    list_serializer = serializers.EmployeeListSerializer
    detail_serializer = serializers.EmployeeDetailSerializer
    create_serializer = serializers.EmployeeCreateSerializer
    update_serializer = serializers.EmployeeUpdateSerializer
    queryset = Employee.objects.all()

# Speical Viewsets
class PositionPermissionViewSet(viewsets.ViewSet):
    queryset = Position.objects.all()
    def list(self, request):
        queryset = Position.objects.all()
        serializer = serializers.PositionPermissionListSerializer(queryset, many=True)
        response = Response(serializer.data)
        response.data = {'positions': response.data}
        return response
