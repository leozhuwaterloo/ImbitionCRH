from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, routers
from imbition import serializers
from imbition.models import Permission, Department, Position, Employee, RecordField, Record
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from django.contrib.auth.models import User
from django.core.exceptions import PermissionDenied
from imbition.permissions import admin_only, get_children, get_readable, get_changable

def index(request):
    return render(request, 'imbition/index.html')

class FourSerializerViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated, )
    def get_serializer_class(self):
        if self.action == 'list':
            return self.list_serializer
        if self.action == 'retrieve':
            return self.detail_serializer
        if self.action == 'create':
            return self.create_serializer
        return self.update_serializer
    # list
    @admin_only
    def create(self, request, *args, **kwargs):
        return super(FourSerializerViewSet, self).create(request, *args, **kwargs)
    @admin_only
    def retrieve(self, request, *args, **kwargs):
        return super(FourSerializerViewSet, self).retrieve(request, *args, **kwargs)
    @admin_only
    def update(self, request, *args, **kwargs):
        return super(FourSerializerViewSet, self).update(request, *args, **kwargs)
    def partial_update(self, request, *args, **kwargs):
        raise PermissionDenied()
    @admin_only
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
    detail_serializer = serializers.DepartmentDetailSerializer
    create_serializer = serializers.DepartmentListAndCreateSerializer
    update_serializer = serializers.DepartmentUpdateAddSerializer
    queryset = Department.objects.all()
    def list(self, request, *args, **kwargs):
        if request.user and request.user.is_staff:
            return super(FourSerializerViewSet, self).list(request, *args, **kwargs)
        elif request.user and request.user.employee and request.user.employee.position:
            departments = set()
            for position in get_readable(request.user.employee.position):
                if position.department: departments.add(position.department)
            serializer = self.list_serializer(departments, many=True)
            return Response(serializer.data)
        raise PermissionDenied()
    def retrieve(self, request, *args, **kwargs):
        if request.user and request.user.is_staff:
            return super(FourSerializerViewSet, self).retrieve(request, *args, **kwargs)
        elif request.user and request.user.employee and request.user.employee.position:
            department = get_object_or_404(Department.objects.all(), pk=kwargs.get('pk', None))
            positions = set()
            for position in get_readable(request.user.employee.position):
                if position.department and position.department.id == department.id:
                    positions.add(position.id)
            if positions:
                serializer = self.detail_serializer(department, context={'positions': positions})
                return Response(serializer.data)

        raise PermissionDenied()
    def update(self, request, *args, **kwargs):
        if request.user and request.user.is_staff:
            self.update_serializer = serializers.DepartmentUpdateReplaceSerializer
        else:
            self.update_serializer = serializers.DepartmentUpdateAddSerializer
        return super(FourSerializerViewSet, self).update(request, *args, **kwargs)

class PositionViewSet(FourSerializerViewSet):
    list_serializer = serializers.PositionListSerializer
    detail_serializer = serializers.PositionDetailSerializer
    create_serializer = serializers.PositionEditSerializer
    update_serializer = serializers.PositionEditSerializer
    queryset = Position.objects.all()
    def list(self, request, *args, **kwargs):
        if request.user and request.user.is_staff:
            return super(FourSerializerViewSet, self).list(request, *args, **kwargs)
        elif request.user and request.user.employee and request.user.employee.position:
            positions = get_readable(request.user.employee.position)
            serializer = self.list_serializer(positions, many=True)
            return Response(serializer.data)
        raise PermissionDenied()
    def update(self, request, *args, **kwargs):
        if request.user and request.user.is_staff:
            return super(FourSerializerViewSet, self).update(request, *args, **kwargs)
        elif request.user and request.user.employee and request.user.employee.position:
            changable = get_changable(request.user.employee.position)
            readable = get_readable(request.user.employee.position)
            position = get_object_or_404(Position.objects.all(), pk=kwargs.get('pk', None))
            # check permissions can be obtained
            if request.data and request.data['permissions']:
                permissions = Permission.objects.all()
                for permissionId in request.data['permissions']:
                    permission = get_object_or_404(permissions, pk=permissionId)
                    if permission in position.permissions.all():
                        continue
                    if permission.permission == Permission.PERMISSION_VIEW and permission.position in readable:
                        continue
                    if permission.permission == Permission.PERMISSION_CHANGE and permission.position in changable:
                        continue
                    raise PermissionDenied()
            # check position can be changed
            if position in changable:
                return super(FourSerializerViewSet, self).update(request, *args, **kwargs)
        raise PermissionDenied()


class EmployeeViewSet(FourSerializerViewSet):
    list_serializer = serializers.EmployeeListSerializer
    detail_serializer = serializers.EmployeeDetailSerializer
    create_serializer = serializers.EmployeeCreateSerializer
    update_serializer = serializers.EmployeeUpdateSerializer
    queryset = Employee.objects.all()
    def list(self, request, *args, **kwargs):
        if request.user and request.user.is_staff:
            return super(FourSerializerViewSet, self).list(request, *args, **kwargs)
        elif request.user and request.user.employee and request.user.employee.position:
            employees = set()
            for position in get_readable(request.user.employee.position):
                for employee in position.employees.all():
                    employees.add(employee)
            serializer = self.list_serializer(employees, many=True)
            return Response(serializer.data)
        raise PermissionDenied()
    def retrieve(self, request, *args, **kwargs):
        if request.user and request.user.is_staff:
            return super(FourSerializerViewSet, self).retrieve(request, *args, **kwargs)
        elif request.user and request.user.employee and request.user.employee.position:
            employee = get_object_or_404(Employee.objects.all(), pk=kwargs.get('pk', None))
            have_access = False
            for position in get_readable(request.user.employee.position):
                if employee in position.employees.all():
                    have_access = True
                    continue
            if not have_access:
                raise PermissionDenied()
            serializer = self.detail_serializer(employee)
            return Response(serializer.data)
        raise PermissionDenied()
    def update(self, request, *args, **kwargs):
        if request.user and request.user.is_staff:
            return super(FourSerializerViewSet, self).update(request, *args, **kwargs)
        elif request.user and request.user.employee and request.user.employee.position:
            employee = get_object_or_404(Employee.objects.all(), pk=kwargs.get('pk', None))
            changable = get_changable(request.user.employee.position)
            # Check if have_access to the employee
            have_access = False
            for position in changable:
                if employee in position.employees.all():
                    have_access = True
                    continue
            if not have_access:
                raise PermissionDenied()

            # Check if have access to position;
            if request.data and request.data['position']:
                position = get_object_or_404(Position.objects.all(), pk=request.data['position'])
                if position not in changable:
                    raise PermissionDenied()

            return super(FourSerializerViewSet, self).update(request, *args, **kwargs)
        raise PermissionDenied()

class RecordFieldViewSet(FourSerializerViewSet):
    list_serializer = serializers.RecordFieldAllSerializer
    detail_serializer = serializers.RecordFieldAllSerializer
    create_serializer = serializers.RecordFieldAllSerializer
    update_serializer = serializers.RecordFieldAllSerializer
    queryset = RecordField.objects.all()
    def list(self, request, *args, **kwargs):
        if request.user and request.user.is_staff:
            return super(FourSerializerViewSet, self).list(request, *args, **kwargs)
        elif request.user and request.user.employee and request.user.employee.position:
            record_fields = set()
            for position in get_readable(request.user.employee.position):
                for record_field in position.record_fields.all():
                    record_fields.add(record_field)
            for record_field in request.user.employee.position.record_fields.all():
                record_fields.add(record_field)
            serializer = self.list_serializer(record_fields, many=True)
            return Response(serializer.data)
        raise PermissionDenied()
    def create(self, request, *args, **kwargs):
        if request.user and request.user.is_staff:
            return super(FourSerializerViewSet, self).create(request, *args, **kwargs)
        elif request.user and request.user.employee and request.user.employee.position:
            if request.data and request.data['position']:
                position = get_object_or_404(Position.objects.all(), pk=request.data['position'])
                if position in get_changable(request.user.employee.position):
                    return super(FourSerializerViewSet, self).create(request, *args, **kwargs)
        raise PermissionDenied()
    def update(self, request, *args, **kwargs):
        if request.user and request.user.is_staff:
            return super(FourSerializerViewSet, self).update(request, *args, **kwargs)
        elif request.user and request.user.employee and request.user.employee.position:
            if request.data and request.data['position']:
                position = get_object_or_404(Position.objects.all(), pk=request.data['position'])
                if position in get_changable(request.user.employee.position):
                    return super(FourSerializerViewSet, self).update(request, *args, **kwargs)
        raise PermissionDenied()


class RecordViewSet(FourSerializerViewSet):
    list_serializer = serializers.RecordAllSerializer
    detail_serializer = serializers.RecordAllSerializer
    create_serializer = serializers.RecordAllSerializer
    update_serializer = serializers.RecordAllSerializer
    queryset = Record.objects.all()
    def list(self, request, *args, **kwargs):
        date = self.request.query_params.get('date', None)
        records = Record.objects.all()
        if date:
            records = records.filter(date = date)
        if request.user and request.user.is_staff:
            pass
        elif request.user and request.user.employee and request.user.employee.position:
            tmp_records = set()
            readable = get_readable(request.user.employee.position)
            for record in records:
                if record.employee.position in readable:
                    tmp_records.add(record)
            records = tmp_records
        serializer = self.list_serializer(records, many=True)
        return Response(serializer.data)
    def create(self, request, *args, **kwargs):
        if request.user and request.user.is_staff:
            return super(FourSerializerViewSet, self).create(request, *args, **kwargs)
        elif request.user and request.user.employee:
            if request.data and request.data['employee'] and request.data['employee'] == request.user.employee.id:
                return super(FourSerializerViewSet, self).create(request, *args, **kwargs)
        raise PermissionDenied()
    def update(self, request, *args, **kwargs):
        if request.user and request.user.is_staff:
            return super(FourSerializerViewSet, self).update(request, *args, **kwargs)
        elif request.user and request.user.employee:
            if request.data and request.data['employee'] and request.data['employee'] == request.user.employee.id:
                return super(FourSerializerViewSet, self).update(request, *args, **kwargs)
        raise PermissionDenied()
# Speical Viewsets
class PositionPermissionViewSet(viewsets.ViewSet):
    permission_classes = (IsAuthenticated, )
    queryset = Position.objects.all()
    def list(self, request):
        if request.user and request.user.is_staff:
            queryset = Position.objects.all()
        elif request.user and request.user.employee and request.user.employee.position:
            queryset = get_readable(request.user.employee.position)
        else:
            raise PermissionDenied()
        serializer = serializers.PositionPermissionListSerializer(queryset, many=True)
        return Response(serializer.data)

class PositionRecordFieldViewSet(viewsets.ViewSet):
    permission_classes = (IsAuthenticated, )
    queryset = Position.objects.all()
    def list(self, request):
        if request.user and request.user.is_staff:
            queryset = Position.objects.all()
        elif request.user and request.user.employee and request.user.employee.position:
            queryset = get_readable(request.user.employee.position)
        else:
            raise PermissionDenied()
        serializer = serializers.PositionRecordFieldListandDetailSerializer(queryset, many=True)
        return Response(serializer.data)
    def retrieve(self, request, pk=None):
        position = get_object_or_404(Position.objects.all(), pk=pk)
        if request.user and request.user.is_staff:
            pass
        elif request.user and request.user.employee and request.user.employee.position:
            if position not in get_readable(request.user.employee.position):
                raise PermissionDenied()
        else:
            raise PermissionDenied()

        serializer = serializers.PositionRecordFieldListandDetailSerializer(position)
        return Response(serializer.data)

class EmployeeRecordViewSet(viewsets.ViewSet):
    permission_classes = (IsAuthenticated, )
    queryset = Employee.objects.all()
    def retrieve(self, request, pk=None):
        employee = get_object_or_404(Employee.objects.all(), pk=pk)
        if (not request.user or not request.user.employee or employee.id != request.user.employee.id) and not request.user.is_staff:
            raise PermissionDenied()
        date = self.request.query_params.get('date', None)
        serializer = serializers.EmployeeRecordDetailSerializer(employee,
            context={'date': date})
        return Response(serializer.data)

class UserDetailViewSet(viewsets.ViewSet):
    permission_classes = (IsAuthenticated, )
    queryset = User.objects.all()
    def retrieve(self, request, pk=None):
        user = get_object_or_404(User.objects.all(), pk=pk)
        if (not request.user or user.id != request.user.id) and not request.user.is_staff:
            raise PermissionDenied()
        employee = get_object_or_404(Employee.objects.all(), user=user)
        serializer = serializers.EmployeeDetailSerializer(employee)
        return Response(serializer.data)

class PositionTreeViewSet(viewsets.ViewSet):
    permission_classes = (IsAuthenticated, )
    queryset = Position.objects.all()
    def retrieve(self, request, pk=None):
        position = get_object_or_404(Position.objects.all(), pk=pk)
        if request.user and request.user.is_staff:
            pass
        elif request.user and request.user.employee and request.user.employee.position and request.user.employee.position.id == position.id:
            pass
        else:
            raise PermissionDenied()
        serializer = serializers.PositionTreeSerializer(position)
        return Response(serializer.data)
