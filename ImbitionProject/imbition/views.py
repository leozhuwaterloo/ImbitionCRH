from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, routers, mixins
from imbition import serializers
from imbition.models import Permission, Department, Position, Employee, RecordField, Record, PendingEmployee, UserSetting, FilterProfile
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
from django.db import connection

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
        super(FourSerializerViewSet, self).destroy(request, *args, **kwargs)
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

class FilterProfileViewSet(FourSerializerViewSet):
    list_serializer = serializers.FilterProfileAllSerializer
    detail_serializer = serializers.FilterProfileAllSerializer
    create_serializer = serializers.FilterProfileAllSerializer
    update_serializer = serializers.FilterProfileAllSerializer
    queryset = FilterProfile.objects.all()
    @admin_only
    def list(self, request, *args, **kwargs):
        return super(FourSerializerViewSet, self).list(request, *args, **kwargs)
    def retrieve(self, request, *args, **kwargs):
        user_id = kwargs.get('pk', None)
        if request.user and (request.user.is_staff or request.user.id == user_id):
            user = get_object_or_404(User.objects.all(), pk=user_id)
            serializer = self.detail_serializer(user.filter_profiles, many=True)
            return Response(serializer.data)
        raise PermissionDenied()
    def create(self, request, *args, **kwargs):
        if request.user and request.user.is_staff:
            return super(FourSerializerViewSet, self).create(request, *args, **kwargs)
        elif request.user:
            user_id = request.data.get('user', None)
            if user_id == request.user.id:
                return super(FourSerializerViewSet, self).create(request, *args, **kwargs)
        raise PermissionDenied()
    def destroy(self, request, *args, **kwargs):
        if request.user and request.user.is_staff:
            super(FourSerializerViewSet, self).destroy(request, *args, **kwargs)
            return Response({})
        elif request.user:
            filter_profile = get_object_or_404(FilterProfile.objects.all(), pk=kwargs.get('pk', None))
            if filter_profile.user.id == request.user.id:
                super(FourSerializerViewSet, self).destroy(request, *args, **kwargs)
                return Response({})
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


class RecordSummaryViewSet(APIView):
    permission_classes = (IsAuthenticated, )
    serializer_class = serializers.RecordSummarySerializer

    def post(self, request, format=None):
        start_date = request.data.get('start_date', None)
        end_date = request.data.get('end_date', None)
        employee_name = request.data.get('employee_name', None)
        employee_phone = request.data.get('employee_phone', None)
        position_name = request.data.get('position_name', None)
        department_name = request.data.get('department_name', None)
        # Validate date
        if start_date is None or end_date is None:
            raise CustomBadRequest("Must specify start_date and end_date")
        try:
            start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
            end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
        except ValueError as e:
            raise CustomBadRequest(str(e))
        if start_date > end_date: raise DateRangeException()

        if request.user and request.user.is_staff:
            readable_ids = None
        elif request.user and request.user.employee and request.user.employee.position:
            readable_ids = set()
            for readable in get_readable(request.user.employee.position):
                readable_ids.append(readable.id)
        else:
            raise PermissionDenied()

        with connection.cursor() as cursor:
            cursor.execute('''
                SELECT CONCAT(authUser.last_name, authUser.first_name) AS employee, employee.phone,
                	pos.name AS position, record.date, depart.name AS department,
                	record.value, record.comment, fie.name, fie.unit, fie.order
                	FROM imbition_employee employee
                LEFT JOIN imbition_position pos
            	ON pos.id = employee.position_id
            	LEFT JOIN imbition_department depart
            	ON depart.id = pos.department_id
            	LEFT JOIN auth_user authUser
            	ON authUser.id = employee.user_id
                LEFT JOIN imbition_record record
                ON employee.id = record.employee_id
                LEFT JOIN imbition_recordfield fie
                ON fie.id = record.field_id

                WHERE (record.date BETWEEN '{start_date}' AND '{end_date}' OR record.date IS NULL)
                {employee_name_query}
                {employee_phone_query}
                {employee_pos_query}
                {employee_depart_query}
                {readable_query}
                ORDER BY fie.order
            '''.format(
                start_date = start_date,
                end_date = end_date,
                employee_name_query = "" if not employee_name else "AND CONCAT(authUser.last_name, authUser.first_name) = '{name}'".format(name=employee_name),
                employee_phone_query = "" if not employee_phone else "AND employee.phone = '{phone}'".format(phone=employee_phone),
                employee_pos_query = "" if not position_name else "AND pos.name = '{name}'".format(name=position_name),
                employee_depart_query = "" if not department_name else "AND depart.name = '{name}'".format(name=department_name),
                readable_query = "" if not readable_ids else "AND pos.id IN ({ids})".format(ids = ','.join(readable_ids)),
            ))
            rows = cursor.fetchall()

        columns = [column[0] for column in cursor.description]
        data = dict()
        order = ['姓名', '手机', '日期', '部门', '岗位']
        fields = set()
        for row in rows:
            row_dict = dict(zip(columns, row))
            key = str(row_dict['phone']) + str(row_dict['date'])
            if key not in data:
                data[key] = dict(
                    姓名=row_dict['employee'],
                    手机=row_dict['phone'],
                    日期=row_dict['date'],
                    部门=row_dict['department'],
                    岗位=row_dict['position'],
                )
            if row_dict['name']:
                value_name = row_dict['name'] + ((' (' + row_dict['unit'] + ')') if row_dict['unit'] else '')
                comment_name = row_dict['name'] + ' 备注'
                data[key][value_name] = row_dict['value']
                data[key][comment_name] = row_dict['comment']
                if value_name not in order: order.append(value_name)
                if comment_name not in order: order.append(comment_name)

        return Response(dict(
            data=sorted(data.values(), key=lambda k: k['日期'] if k['日期'] is not None else date.min),
            order=order,
        ))
