# Generated by Django 2.0.4 on 2018-05-22 00:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('imbition', '0021_pendingemployee_created_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='pendingemployee',
            name='password',
            field=models.CharField(max_length=25),
        ),
    ]
