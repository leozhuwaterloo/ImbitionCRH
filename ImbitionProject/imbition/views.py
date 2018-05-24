from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, routers, mixins
from imbition import serializers
from imbition.models import Permission, Department, Position, Employee, RecordField, Record, PendingEmployee, UserSetting
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from django.contrib.auth.models import User
from django.core.exceptions import PermissionDenied
from imbition.permissions import admin_only, get_children, get_readable, get_changable
from imbition.permissions import DateRangeException, CustomBadRequest, CustomResourceNotFound
from datetime import timedelta, date, datetime
import string
import random

def daterange(start_date, end_date):
    for n in range(int((end_date - start_date).days) + 1):
        yield start_date + timedelta(n)

def index(request):
    return render(request, 'imbition/index.html')


def random_string(length):
    return ''.join(random.SystemRandom().choice(string.ascii_uppercase + string.digits) for _ in range(length))


class PendingEmployeeCheckView(APIView):
    permission_classes = []
    authentication_classes = []
    serializer_class = serializers.PendingEmployeeCheckSerializer

    def post(self, request, format=None):
        phone = request.data.get('phone', None)
        first_name = request.data.get('first_name', None)
        last_name = request.data.get('last_name', None)
        username = request.data.get('username', None)
        if phone is None or first_name is None or last_name is None or username is None:
            raise CustomBadRequest("Must specify phone, first_name, last_name and username")
        pending_employee = PendingEmployee.objects.filter(phone=phone, first_name=first_name, last_name=last_name).first()
        if pending_employee is not None:
            if User.objects.filter(username=username).exists():
                raise CustomBadRequest("用户名已存在")

            password = random_string(25)
            try:
                user = User(username=username)
                user.set_password(password)
                user.first_name = first_name
                user.last_name = last_name
                user.save()
                Employee(user=user, position=pending_employee.position, phone=phone).save()
            except Exception as e:
                raise e

            pending_employee.username = username
            pending_employee.password = password
            serializer = serializers.PendingEmployeeListAndDetailSerializer(pending_employee)
            pending_employee.delete()
        else:
            raise CustomResourceNotFound("对不起，您提供的信息有误")
        return Response(serializer.data)


class PasswordResetView(APIView):
    permission_classes = []
    authentication_classes = []
    serializer_class = serializers.PasswordResetSerializer

    def post(self, request, format=None):
        user_id = request.data.get('user_id', None)
        user = get_object_or_404(User.objects.all(), pk=user_id)
        old_password = request.data.get('old_password', None)
        if not user.check_password(old_password):
            raise CustomResourceNotFound("对不起，您提供的信息有误")

        new_password = request.data.get('new_password', None)
        new_password_confirm = request.data.get('new_password_confirm', None)
        if new_password != new_password_confirm:
            raise CustomResourceNotFound("两次输出密码不一致")
        if not new_password:
            raise CustomResourceNotFound("密码不可为空")

        user.set_password(new_password)
        user.save()
        return Response({ 'detail': '密码修改成功' })

# View Set
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
            if not request.user.employee.id == employee.id:
                have_access = False
                for position in get_readable(request.user.employee.position):
                    if employee in position.employees.all():
                        have_access = True
                        continue
                if not have_access:
                    raise PermissionDenied()
            serializer = self.detail_serializer(employee, context={"request": request})
            return Response(serializer.data)
        raise PermissionDenied()
    def update(self, request, *args, **kwargs):
        if request.user and request.user.is_staff:
            return super(FourSerializerViewSet, self).update(request, *args, **kwargs)
        elif request.user and request.user.employee and request.user.employee.position:
            changable = get_changable(request.user.employee.position)
            employee = get_object_or_404(Employee.objects.all(), pk=kwargs.get('pk', None))
            request_isself = request.user.employee.id == employee.id
            if not request_isself:
                # Check if have_access to the employee
                have_access = False
                for position in changable:
                    if employee in position.employees.all():
                        have_access = True
                        continue
                if not have_access:
                    raise PermissionDenied()
            else:
                if request.data and request.data['position'] and not request.data['position'] == request.user.employee.position.id:
                    raise CustomBadRequest("你不可以修改自己的职位")

            # Check if have access to position;
            if request.data and request.data['position'] and not request_isself:
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

class UserSettingViewSet(FourSerializerViewSet):
    list_serializer = serializers.UserSettingAllSerializer
    detail_serializer = serializers.UserSettingAllSerializer
    create_serializer = serializers.UserSettingAllSerializer
    update_serializer = serializers.UserSettingAllSerializer
    queryset = UserSetting.objects.all()
    @admin_only
    def list(self, request, *args, **kwargs):
        return super(FourSerializerViewSet, self).list(request, *args, **kwargs)

class PendingEmployeeViewSet(FourSerializerViewSet):
    list_serializer = serializers.PendingEmployeeListAndDetailSerializer
    detail_serializer = serializers.PendingEmployeeListAndDetailSerializer
    create_serializer = serializers.PendingEmployeeEditSerializer
    update_serializer = serializers.PendingEmployeeEditSerializer
    queryset = PendingEmployee.objects.all()
    @admin_only
    def list(self, request, *args, **kwargs):
        return super(FourSerializerViewSet, self).list(request, *args, **kwargs)

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
        serializer = serializers.EmployeeDetailSerializer(employee, context={"request": request})
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


class RecordSummaryViewSet(viewsets.ViewSet):
    permission_classes = (IsAuthenticated, )
    queryset = Record.objects.all()
    def list(self, request):
        startDate = self.request.query_params.get('startDate', None)
        endDate = self.request.query_params.get('endDate', None)
        if startDate is None or endDate is None:
            raise PermissionDenied()
        startDate = datetime.strptime(startDate, '%Y-%m-%d').date()
        endDate = datetime.strptime(endDate, '%Y-%m-%d').date()
        if startDate > endDate: raise DateRangeException()
        records = Record.objects.filter(date__range=[startDate, endDate])
        fieldNames = set()
        data = list()
        recordmaps = dict()
        ordermap = dict()
        if request.user and request.user.is_staff:
            employees = Employee.objects.all()
        else:
            employees = set()
            for position in get_readable(request.user.employee.position):
                for employee in position.employees.all():
                    employees.add(employee)
        for record in records:
            if record.field.disabled:
                continue
            fieldName = record.field.name + ((" (%s)" % record.field.unit) if record.field.unit else "")
            if fieldName not in ordermap or ordermap[fieldName] < record.field.order:
                ordermap[fieldName] = record.field.order
            fieldNames.add(fieldName)
            if record.employee.id not in recordmaps:
                recordmaps[record.employee.id] = dict();
            if record.date not in recordmaps[record.employee.id]:
                recordmaps[record.employee.id][record.date] = dict();

            recordmaps[record.employee.id][record.date][fieldName] = record;

        for date in daterange(startDate, endDate):
            for employee in employees:
                employeeData = dict()
                employeeData["姓名"] = employee.get_full_name()
                employeeData["手机"] = employee.phone
                employeeData["岗位"] = employee.position.name if employee.position else None
                employeeData["部门"] = employee.position.department.name if employee.position and employee.position.department else None
                employeeData["日期"] = date
                for fieldName in fieldNames:
                    if employee.id in recordmaps and date in recordmaps[employee.id] and fieldName in recordmaps[employee.id][date]:
                        employeeData[fieldName] = recordmaps[employee.id][date][fieldName].value
                        employeeData["%s 备注" % fieldName] = recordmaps[employee.id][date][fieldName].comment
                    else:
                        employeeData[fieldName] = None
                        employeeData["%s 备注" % fieldName] = None
                data.append(employeeData)

        order = []
        order.append("姓名")
        order.append("手机")
        order.append("岗位")
        order.append("部门")
        order.append("日期")
        for fieldName in sorted(fieldNames, key=lambda name: ordermap[name]):
            order.append(fieldName)
            order.append("%s 备注" % fieldName)


        return Response(dict(
            data=data,
            order=order,
        ))
