# -*- coding: utf-8 -*-
# Generated by Django 1.11.12 on 2018-04-21 14:20
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0012_auto_20180421_1406'),
    ]

    operations = [
        migrations.AlterField(
            model_name='transparencyapp',
            name='children',
            field=models.ManyToManyField(related_name='_transparencyapp_children_+', to='accounts.TransparencyApp'),
        ),
    ]