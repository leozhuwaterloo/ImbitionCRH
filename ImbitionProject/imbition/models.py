from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError

class Permission(models.Model):
    PERMISSION_VIEW = 1
    PERMISSION_CHANGE = 2
    PERMISSION_ADD_DELETE = 3
    PERMISSION_CHOICES = (
        (PERMISSION_VIEW, '查看'),
        (PERMISSION_CHANGE, '修改'),
        (PERMISSION_ADD_DELETE, '添加与删除'),
    )
    description = models.CharField(max_length=150, null=False, unique=True)
    position = models.ForeignKey('Position', on_delete=models.CASCADE, null=False, blank=False, related_name='accessed_by')
    permission = models.IntegerField(choices=PERMISSION_CHOICES, null=False)

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
            if not position_permission.filter(permission=Permission.PERMISSION_ADD_DELETE).exists():
                Permission(position=self, permission=Permission.PERMISSION_ADD_DELETE).save()
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
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="employee")
    phone = models.CharField(max_length=30, null=True, unique=True)
    portrait = models.FileField(upload_to='portrait/', null=True)
    position = models.ForeignKey(Position, on_delete=models.SET_NULL, null=True, blank=True, related_name="employees")

    def __str__(self):
        return self.user.last_name + self.user.first_name + ' - ' + self.user.username
