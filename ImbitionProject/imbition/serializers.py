from imbition.models import Permission, Department, Position, Employee, RecordField, Record, PendingEmployee, UserSetting
from rest_framework import serializers
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from imbition.permissions import get_changable, CustomPermissionDenied
from django.core.exceptions import PermissionDenied
import urllib.request
from django.core.files.temp import NamedTemporaryFile
from django.core.files import File
# Edit Serializer are for both create and update

# UserSetting
class UserSettingAllSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSetting
        fields = ('id', 'user', 'notify_warning', 'notify_success', 'notify_error')

# Department
class DepartmentListAndCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ('id', 'name')

# Position List Serializer moved here as we need it later
class PositionListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Position
        fields = ('id', 'name', 'department', 'record_fields')
    department = DepartmentListAndCreateSerializer()

# Continue Department
class DepartmentDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ('id', 'name', 'positions')
    positions = serializers.SerializerMethodField()
    def get_positions(self, obj):
        positions = self.context.get('positions')
        if positions is not None:
            return positions
        else:
            return obj.positions.values_list('id', flat=True)

class DepartmentUpdateAddSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ('id', 'name', 'positions')
    def update(self, instance, validated_data, **kwargs):
        # We dont need to add bypass for admin user as they call replace directly
        request = self.context.get('request', None)
        changable = []
        if request and request.user and request.user.employee and request.user.employee.position:
            changable = get_changable(request.user.employee.position)
        positions = validated_data.get('positions', [])
        invalid_positions = []
        for position in positions:
            if position in changable:
                position.department = instance
                position.save()
            elif (not position.department) or position.department.id != instance.id:
                invalid_positions.append(position.name)
        instance.save()

        if not invalid_positions:
            return instance
        else:
            raise CustomPermissionDenied("你没有修改(%s)的权限" % ', '.join(invalid_positions))

class DepartmentUpdateReplaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ('id', 'name', 'positions')

# Permission
class PermissionListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ('id', 'description')
class PermissionDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ('id', 'description', 'position', 'permission', 'owned_by')
    position = PositionListSerializer()
    owned_by = PositionListSerializer(many=True)
class PermissionEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ('id', 'position', 'permission')

# Position
# Position List Serializer moved to the top

# Employee List Serializer (moved here before we need to use it later)
class UserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name')
class EmployeeListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ('id', 'user', 'phone', 'position')
    user = UserListSerializer()
    position = PositionListSerializer()

# Continue Position
class PositionDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Position
        fields = ('id', 'name', 'parent', 'department', 'permissions', 'employees')
    parent = PositionListSerializer()
    department = DepartmentListAndCreateSerializer()
    permissions = PermissionListSerializer(many=True)
    employees = EmployeeListSerializer(many=True)
class PositionEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = Position
        fields = ('id', 'name', 'parent', 'department', 'permissions')


# Employee Detail Serializer
class UserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'email', 'last_login', 'date_joined', 'setting')
    last_login = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S')
    date_joined = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S')
    setting = UserSettingAllSerializer()
class EmployeeDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ('id', 'user', 'phone', 'portrait', 'position')
    user = UserDetailSerializer()
    position = PositionListSerializer()
    portrait = serializers.SerializerMethodField()

    # Make sure url is absolute
    def get_portrait(self, instance):
        if instance.portrait:
            request = self.context.get('request', None)
            return request.build_absolute_uri(instance.portrait.url)
        else:
            return None
# Employee Create Serializer
class UserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'first_name', 'last_name', 'email')
class EmployeeCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ('id', 'user', 'phone', 'portrait', 'position')
    user =  UserCreateSerializer()
    def create(self, validated_data):
        validated_data["user"] = User.objects.create_user(**validated_data.get("user", {}))
        new_employee = Employee(**validated_data)
        new_employee.save()
        return new_employee

# Employee Update Serializer
class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name', 'email')
class EmployeeUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ('id', 'user', 'phone', 'portrait', 'position')
    user = UserUpdateSerializer()
    portrait = serializers.URLField(allow_blank=True)
    def update(self, instance, validated_data):
        user = validated_data.get('user', {})
        instance.user.first_name = user.get('first_name', None)
        instance.user.last_name = user.get('last_name', None)
        instance.user.email = user.get('email', None)
        instance.user.save()
        instance.phone = validated_data.get('phone', None)
        portrait = validated_data.get('portrait', None)
        if portrait:
            img_temp = NamedTemporaryFile(delete=True)
            img_temp.write(urllib.request.urlopen(portrait).read())
            img_temp.flush()
            instance.portrait.save("%s.png" % instance.user.username, File(img_temp))
        instance.position = validated_data.get('position', None)
        instance.save()
        return instance

# Record Field
class RecordFieldAllSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecordField
        fields = ('id', 'position', 'name', 'unit', 'order', 'disabled')

# Record
class RecordAllSerializer(serializers.ModelSerializer):
    class Meta:
        model = Record
        fields = ('id', 'employee', 'field', 'value', 'comment', 'date')

# Pending Employee
class PendingEmployeeUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', )
class PendingEmployeeListAndDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = PendingEmployee
        fields = ('id', 'phone', 'first_name', 'last_name', 'position', 'user', 'password')
    user = PendingEmployeeUserSerializer()
class PendingEmployeeEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = PendingEmployee
        fields = ('id', 'phone', 'first_name', 'last_name', 'position')

# Special Serializers
class PositionPermissionListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Position
        fields = ('id', 'name', 'parent', 'department', 'permissions')

class PositionRecordFieldListandDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Position
        fields = ('id', 'name', 'department', 'record_fields')
    record_fields = RecordFieldAllSerializer(many=True)

class EmployeeRecordDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ('id', 'user', 'position', 'records')
    user = UserListSerializer()
    records = serializers.SerializerMethodField()

    def get_records(self, obj):
        date = self.context.get('date')
        if date:
            return RecordAllSerializer(obj.records.filter(date=date), many=True).data
        return RecordAllSerializer(obj.records, many=True).data

class PositionTreeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Position
        fields = ('name', 'children')
    children = serializers.SerializerMethodField()

    def get_children(self, obj):
        if obj.children is not None:
            return PositionTreeSerializer(obj.children, many=True).data
        else:
            return None
