# Generated by Django 2.0.4 on 2018-05-16 02:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('imbition', '0018_recordfield_order'),
    ]

    operations = [
        migrations.AddField(
            model_name='recordfield',
            name='disabled',
            field=models.BooleanField(default=True),
            preserve_default=False,
        ),
    ]
