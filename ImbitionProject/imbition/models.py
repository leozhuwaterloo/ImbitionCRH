from django.db import models
from django.contrib.auth.models import User


class Permission(models.Model):
    PERMISSION_DENY = 0
    PERMISSION_VIEW = 1
    PERMISSION_EDIT = 2
    PERMISSION_CHOICES = (
        (PERMISSION_DENY, 'Deny'),
        (PERMISSION_VIEW, 'View'),
        (PERMISSION_EDIT, 'Edit'),
    )
    description = models.CharField(max_length=150, null=False, unique=True)
    access = models.CharField(max_length=50, null=False)
    permission = models.IntegerField(choices=PERMISSION_CHOICES, null=False)

    def __str__(self):
        return self.description

class PermissionGroup(models.Model):
    group_name = models.CharField(max_length=50, null=False, unique=True)
    permissions = models.ManyToManyField(Permission)

    def __str__(self):
        return self.group_name

class Employee(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone = models.CharField(max_length=30, null=True)
    portrait = models.FileField(upload_to='portrait/', null=True)
    permission_group = models.ForeignKey(PermissionGroup, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.user.get_full_name() + " - " + self.user.username
