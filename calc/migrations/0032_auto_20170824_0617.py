# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-08-24 06:17
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('calc', '0031_auto_20170823_0138'),
    ]

    operations = [
        migrations.AddField(
            model_name='collectir',
            name='colAll',
            field=models.CharField(blank=True, default='0', max_length=10, verbose_name='\u6240\u6709\u4eba\u5e38\u7528'),
        ),
        migrations.AddField(
            model_name='collectkeypad',
            name='colAll',
            field=models.CharField(blank=True, default='0', max_length=10, verbose_name='\u6240\u6709\u4eba\u5e38\u7528'),
        ),
        migrations.AddField(
            model_name='collectlogo',
            name='colAll',
            field=models.CharField(blank=True, default='0', max_length=10, verbose_name='\u6240\u6709\u4eba\u5e38\u7528'),
        ),
        migrations.AddField(
            model_name='collectpanel',
            name='colAll',
            field=models.CharField(blank=True, default='0', max_length=10, verbose_name='\u6240\u6709\u4eba\u5e38\u7528'),
        ),
        migrations.AddField(
            model_name='collectpq',
            name='colAll',
            field=models.CharField(blank=True, default='0', max_length=10, verbose_name='\u6240\u6709\u4eba\u5e38\u7528'),
        ),
        migrations.AddField(
            model_name='collectproject',
            name='colAll',
            field=models.CharField(blank=True, default='0', max_length=10, verbose_name='\u6240\u6709\u4eba\u5e38\u7528'),
        ),
    ]
