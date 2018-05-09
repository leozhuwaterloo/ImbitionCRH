# Generated by Django 2.0.4 on 2018-05-06 03:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('imbition', '0013_auto_20180429_0124'),
    ]

    operations = [
        migrations.AlterField(
            model_name='permission',
            name='permission',
            field=models.IntegerField(choices=[(1, '查看'), (2, '修改')]),
        ),
        migrations.AlterUniqueTogether(
            name='permission',
            unique_together={('position', 'permission')},
        ),
    ]
