# -*- coding: utf-8 -*-
# Generated by Django 1.11.12 on 2018-04-21 20:29
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0018_transparencyapp_users'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='transparencyapp',
            name='users',
        ),
        migrations.AddField(
            model_name='transparencyuser',
            name='apps',
            field=models.ManyToManyField(to='accounts.TransparencyApp'),
        ),
    ]
