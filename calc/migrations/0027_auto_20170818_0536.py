# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-08-18 05:36
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('calc', '0026_auto_20170809_0833'),
    ]

    operations = [
        migrations.RenameField(
            model_name='cloudproject',
            old_name='game_enable',
            new_name='game',
        ),
        migrations.AddField(
            model_name='cloudproject',
            name='dmp_show',
            field=models.CharField(blank=True, default='', max_length=10, verbose_name='\u591a\u5a92\u4f53\u663e\u793aUSB'),
        ),
        migrations.AddField(
            model_name='cloudproject',
            name='new_menu',
            field=models.CharField(blank=True, default='', max_length=10, verbose_name='\u65b0\u83dc\u5355'),
        ),
        migrations.AddField(
            model_name='cloudproject',
            name='show_power',
            field=models.CharField(blank=True, default='', max_length=10, verbose_name='\u7535\u91cf\u663e\u793a'),
        ),
        migrations.AddField(
            model_name='cloudproject',
            name='tow_u_copy',
            field=models.CharField(blank=True, default='', max_length=10, verbose_name='\u53ccU\u4e92\u62f7'),
        ),
        migrations.AddField(
            model_name='cloudproject',
            name='usb_last_memory',
            field=models.CharField(blank=True, default='', max_length=10, verbose_name='USB\u65ad\u7535\u8bb0\u5fc6'),
        ),
        migrations.AlterField(
            model_name='cloudproject',
            name='logo_name',
            field=models.CharField(blank=True, default='', max_length=256, verbose_name='LOGO\u540d\u5b57'),
        ),
        migrations.AlterField(
            model_name='cloudproject',
            name='notes',
            field=models.CharField(blank=True, max_length=256, verbose_name='\u5907\u6ce8'),
        ),
        migrations.AlterField(
            model_name='user',
            name='user_author',
            field=models.CharField(blank=True, default='3', max_length=20, verbose_name='\u7528\u6237\u6743\u9650'),
        ),
        migrations.AlterField(
            model_name='user',
            name='user_pwd',
            field=models.CharField(blank=True, default='2891baceeef1652ee698294da0e71ba78a2a4064', max_length=256, verbose_name='user_pwd'),
        ),
    ]
