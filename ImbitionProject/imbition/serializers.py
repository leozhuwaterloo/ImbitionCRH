from imbition.models import Permission, Department, Position, Employee
from rest_framework import serializers
from django.contrib.auth.models import User

# Edit Serializer are for both create and update

# Department
class DepartmentListAndCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ('id', 'name')

# Position List Serializer moved here as we need it later
class PositionListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Position
        fields = ('id', 'name', 'department')
    department = DepartmentListAndCreateSerializer()

# Continue Department
class DepartmentDetailAndUpdateSerializer(serializers.ModelSerializer):
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
        fields = ('id', 'username', 'first_name', 'last_name', 'email', 'last_login', 'date_joined')
    last_login = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S')
    date_joined = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S')
class EmployeeDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ('id', 'user', 'phone', 'portrait', 'position')
    user = UserDetailSerializer()
    position = PositionListSerializer()

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
    def update(self, instance, validated_data):
        user = validated_data.get('user', {})
        instance.user.first_name = user.get('first_name', None)
        instance.user.last_name = user.get('last_name', None)
        instance.user.email = user.get('email', None)
        instance.user.save()
        instance.phone = validated_data.get('phone', None)
        instance.portrait =validated_data.get('portrait', None)
        instance.position = validated_data.get('position', None)
        instance.save()
        return instance


# Special Serializers
class PositionPermissionListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Position
        fields = ('id', 'name', 'parent', 'department', 'permissions')

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
