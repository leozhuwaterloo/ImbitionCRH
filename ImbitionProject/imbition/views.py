from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, routers
from imbition import serializers
from imbition.models import Permission, Department, Position, Employee, RecordField, Record
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from django.contrib.auth.models import User
from datetime import date

def index(request):
    return render(request, 'imbition/index.html')

class FourSerializerViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAdminUser, )
    def get_serializer_class(self):
        if self.action == 'list':
            return self.list_serializer
        if self.action == 'retrieve':
            return self.detail_serializer
        if self.action == 'create':
            return self.create_serializer
        return self.update_serializer
    def destroy(self, request, *args, **kwargs):
        response = super(FourSerializerViewSet, self).destroy(request, *args, **kwargs)
        return Response({}) # no status, and have body as otherwise it halts the api fetch

class PermissionViewSet(FourSerializerViewSet):
    list_serializer = serializers.PermissionListSerializer
    detail_serializer = serializers.PermissionDetailSerializer
    create_serializer = serializers.PermissionEditSerializer
    update_serializer = serializers.PermissionEditSerializer
    queryset = Permission.objects.all()

class DepartmentViewSet(FourSerializerViewSet):
    list_serializer = serializers.DepartmentListAndCreateSerializer
    detail_serializer = serializers.DepartmentDetailAndUpdateSerializer
    create_serializer = serializers.DepartmentListAndCreateSerializer
    update_serializer = serializers.DepartmentDetailAndUpdateSerializer
    queryset = Department.objects.all()

class PositionViewSet(FourSerializerViewSet):
    list_serializer = serializers.PositionListSerializer
    detail_serializer = serializers.PositionDetailSerializer
    create_serializer = serializers.PositionEditSerializer
    update_serializer = serializers.PositionEditSerializer
    queryset = Position.objects.all()

class EmployeeViewSet(FourSerializerViewSet):
    list_serializer = serializers.EmployeeListSerializer
    detail_serializer = serializers.EmployeeDetailSerializer
    create_serializer = serializers.EmployeeCreateSerializer
    update_serializer = serializers.EmployeeUpdateSerializer
    queryset = Employee.objects.all()

class RecordFieldViewSet(FourSerializerViewSet):
    list_serializer = serializers.RecordFieldAllSerializer
    detail_serializer = serializers.RecordFieldAllSerializer
    create_serializer = serializers.RecordFieldAllSerializer
    update_serializer = serializers.RecordFieldAllSerializer
    queryset = RecordField.objects.all()

# Speical Viewsets
class PositionPermissionViewSet(viewsets.ViewSet):
    queryset = Position.objects.all()
    def list(self, request):
        queryset = Position.objects.all()
        serializer = serializers.PositionPermissionListSerializer(queryset, many=True)
        return Response(serializer.data)

class PositionRecordFieldViewSet(viewsets.ViewSet):
    queryset = Position.objects.all()
    def list(self, request):
        queryset = Position.objects.all()
        serializer = serializers.PositionRecordFieldListandDetailSerializer(queryset, many=True)
        return Response(serializer.data)
    def retrieve(self, request, pk=None):
        queryset = Position.objects.all()
        position = get_object_or_404(queryset, pk=pk)
        serializer = serializers.PositionRecordFieldListandDetailSerializer(position)
        return Response(serializer.data)

class EmployeeRecordViewSet(viewsets.ViewSet):
    queryset = Employee.objects.all()
    def retrieve(self, request, pk=None):
        queryset = Employee.objects.all()
        employee = get_object_or_404(queryset, pk=pk)
        serializer = serializers.EmployeeRecordDetailSerializer(employee)
        return Response(serializer.data)

class UserDetailViewSet(viewsets.ViewSet):
    queryset = User.objects.all()
    def retrieve(self, request, pk=None):
        queryset = User.objects.all()
        user = get_object_or_404(queryset, pk=pk)
        employee = get_object_or_404(Employee.objects.all(), user=user)
        serializer = serializers.EmployeeDetailSerializer(employee)
        return Response(serializer.data)

class PositionTreeViewSet(viewsets.ViewSet):
    queryset = Position.objects.all()
    def retrieve(self, request, pk=None):
        queryset = Position.objects.all()
        position = get_object_or_404(queryset, pk=pk)
        serializer = serializers.PositionTreeSerializer(position)
        return Response(serializer.data)
