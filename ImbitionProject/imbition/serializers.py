from imbition.models import Employee, Permission, PermissionGroup
from rest_framework import serializers
from django.contrib.auth.models import User

class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ('id', 'description', 'access', 'permission')

class PermissionGroupEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = PermissionGroup
        fields = ('id', 'group_name', 'permissions')

class PermissionGroupViewSerializer(PermissionGroupEditSerializer):
    permissions = PermissionSerializer(read_only=True, many=True)

# Employee Create
class UserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'first_name', 'last_name', 'email')
class EmployeeCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ('id', 'user', 'phone', 'permission_group')
    user =  UserCreateSerializer()

    def create(self, validated_data):
        validated_data["user"] = User.objects.create_user(**validated_data.get("user", {}))
        new_employee = Employee(**validated_data)
        new_employee.save()
        return new_employee

# Employee Edit
class UserEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name', 'email')
class EmployeeEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ('id', 'user', 'phone', 'portrait', 'permission_group')
    user = UserEditSerializer()
    def update(self, instance, validated_data):
        user = validated_data.get('user', {})
        instance.user.first_name = user.get('first_name', None)
        instance.user.last_name = user.get('last_name', None)
        instance.user.email = user.get('email', None)
        instance.user.save()
        instance.phone = validated_data.get('phone', None)
        instance.portrait =validated_data.get('portrait', None)
        instance.permission_group = validated_data.get('permission_group', None)
        instance.save()
        return instance

# Employee Detail View
class UserViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'email', 'last_login', 'date_joined')
    last_login = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S')
    date_joined = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S')


class EmployeeViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ('id', 'user', 'phone', 'portrait', 'permission_group')
    user = UserViewSerializer(read_only=True)
    permission_group = PermissionGroupViewSerializer(read_only=True)
