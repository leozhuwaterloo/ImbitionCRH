# Generated by Django 2.0.4 on 2018-05-12 19:03

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('imbition', '0015_pendingemployee'),
    ]

    operations = [
        migrations.AddField(
            model_name='pendingemployee',
            name='user',
            field=models.OneToOneField(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='pending_employee', to=settings.AUTH_USER_MODEL),
            preserve_default=False,
        ),
    ]