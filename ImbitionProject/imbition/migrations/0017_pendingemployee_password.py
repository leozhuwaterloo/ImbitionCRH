# Generated by Django 2.0.4 on 2018-05-12 20:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('imbition', '0016_pendingemployee_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='pendingemployee',
            name='password',
            field=models.CharField(default=1, max_length=10),
            preserve_default=False,
        ),
    ]