from django.db import models
from django.contrib.auth.models import User
import uuid
from datetime import date
from rest_framework.exceptions import APIException
import string
import random


class UserSetting(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='setting')
    notify_warning = models.BooleanField(null=False, default=True)
    notify_success = models.BooleanField(null=False, default=True)
    notify_error = models.BooleanField(null=False, default=True)


class Permission(models.Model):
    PERMISSION_VIEW = 1
    PERMISSION_CHANGE = 2
    PERMISSION_CHOICES = (
        (PERMISSION_VIEW, '查看'),
        (PERMISSION_CHANGE, '修改'),
    )
    description = models.CharField(max_length=150, null=False, unique=True)
    position = models.ForeignKey('Position', on_delete=models.CASCADE, null=False, blank=False, related_name='accessed_by')
    permission = models.IntegerField(choices=PERMISSION_CHOICES, null=False)

    class Meta:
        unique_together = ('position', 'permission', )

    def save(self, *args, **kwargs):
        self.description = self.PERMISSION_CHOICES[self.permission-1][1] + self.position.name
        super(Permission, self).save(*args, **kwargs)

    def __str__(self):
        return self.description

class Department(models.Model):
    name = models.CharField(max_length=50, null=False, unique=True)

    def __str__(self):
        return self.name


class Position(models.Model):
    name= models.CharField(max_length=50, null=False, unique=True)
    parent = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='children')
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True, related_name='positions')
    permissions = models.ManyToManyField(Permission, blank=True, related_name='owned_by')

    def save(self, *args, **kwargs):
        super(Position, self).save(*args, **kwargs)
        # if save is successful, create permissions of the position if there isn't any
        try:
            position_permission = Permission.objects.filter(position=self)
            if not position_permission.filter(permission=Permission.PERMISSION_VIEW).exists():
                Permission(position=self, permission=Permission.PERMISSION_VIEW).save()
            if not position_permission.filter(permission=Permission.PERMISSION_CHANGE).exists():
                new_permission = Permission(position=self, permission=Permission.PERMISSION_CHANGE)
                new_permission.save()
            else:
                new_permission = position_permission.filter(permission=Permission.PERMISSION_CHANGE).first()
            if self.parent:
                self.parent.permissions.add(new_permission)
        except Exception as e:
            self.delete()
            raise e

    def __str__(self):
        return self.name

class Employee(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='employee')
    phone = models.CharField(max_length=30, null=True, unique=True)
    portrait = models.FileField(upload_to='portrait/', null=True)
    position = models.ForeignKey(Position, on_delete=models.SET_NULL, null=True, blank=True, related_name='employees')

    def get_full_name(self):
        return self.user.last_name + self.user.first_name

    def __str__(self):
        return self.user.last_name + self.user.first_name + ' - ' + self.user.username

class RecordField(models.Model):
    position = models.ForeignKey(Position, on_delete=models.SET_NULL, null=True, blank=True, related_name="record_fields")
    name = models.CharField(max_length=50, null=False)
    unit = models.CharField(max_length=10, null=True)
    order = models.IntegerField(null=False)
    disabled = models.BooleanField(null=False)

    class Meta:
        unique_together = ('position', 'name', )

    def __str__(self):
        return self.name + ' - ' + self.position.name

class Record(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, null=False, blank=True, related_name="records")
    field = models.ForeignKey(RecordField, on_delete=models.CASCADE, null=False, blank=True, related_name="records")
    value = models.DecimalField(max_digits=15, decimal_places=5, null=True)
    comment = models.CharField(max_length=200, null=True)
    date = models.DateField(default=date.today, null=False)
    last_modified = models.DateTimeField(auto_now=True, null=False)

    class Meta:
        unique_together = ('field', 'date', 'employee', )

    def __str__(self):
        return self.employee.user.last_name + self.employee.user.first_name + ' - ' + str(self.field)


def random_string(length):
    return ''.join(random.SystemRandom().choice(string.ascii_uppercase + string.digits) for _ in range(length))

class PendingEmployee(models.Model):
    phone = models.CharField(max_length=30, null=False, unique=True)
    first_name = models.CharField(max_length=75, null=False)
    last_name = models.CharField(max_length=75, null=False)
    position = models.ForeignKey(Position, on_delete=models.CASCADE, null=False, blank=True, related_name="pending_employees")
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="pending_employee")
    password = models.CharField(max_length = 10, null=False)
    def save(self, *args, **kwargs):
        if not Employee.objects.filter(phone = self.phone).exists():
            try:
                username = random_string(10)
                self.password = random_string(10)
                while User.objects.filter(username=username).exists():
                    username = random_string(10)
                self.user = User.objects.create_user(username, None, self.password)
                self.user.last_name = self.last_name
                self.user.first_name = self.first_name
                self.user.save()
                Employee(user=self.user, position=self.position, phone=self.phone).save()
                super(PendingEmployee, self).save(*args, **kwargs)
            except Exception as e:
                raise e
        else:
            raise APIException("已经有员工使用此手机号了")

    def __str__(self):
        return self.last_name + self.first_name + ' - ' + self.phone
