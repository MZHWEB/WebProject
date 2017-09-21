# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-08-22 13:15
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('calc', '0029_user_user_language'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='user_company',
            field=models.CharField(blank=True, default='', max_length=256, verbose_name='\u6240\u5c5e\u516c\u53f8'),
        ),
        migrations.AlterField(
            model_name='user',
            name='user_icon',
            field=models.FileField(default='/Images/user/jdface/16247_100.gif', upload_to='./Images/user/jdface/', verbose_name='\u7528\u6237\u5934\u50cf'),
        ),
        migrations.AlterField(
            model_name='user',
            name='user_name',
            field=models.CharField(blank=True, default='', max_length=256, verbose_name='\u7528\u6237\u540d'),
        ),
        migrations.AlterField(
            model_name='user',
            name='user_pwd',
            field=models.CharField(blank=True, default='2891baceeef1652ee698294da0e71ba78a2a4064', max_length=256, verbose_name='\u5bc6\u7801'),
        ),
        migrations.AlterField(
            model_name='user',
            name='user_telphone',
            field=models.CharField(blank=True, default='', max_length=256, verbose_name='\u8054\u7cfb\u7535\u8bdd'),
        ),
        migrations.AlterField(
            model_name='user',
            name='user_time',
            field=models.CharField(blank=True, default='', max_length=256, verbose_name='\u521b\u5efa\u65f6\u95f4'),
        ),
    ]
