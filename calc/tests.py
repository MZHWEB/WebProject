# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.test import TestCase
from .models import LanguageConfig,User,ProjectConfig,CollectProject
# Create your tests here.



class LanguageTest(TestCase):
    def language_create(self):
        #LanguageConfig.objects.get_or_create(language_name="英语",language_flag = 'A,B,')
        #LanguageConfig.objects.get_or_create(language_name="法语",language_flag = 'A,B,')

        #ProjectConfig.objects.get_or_create(project_name='MV56_80PIN',project_flag = 'A')
        #ProjectConfig.objects.get_or_create(project_name='MV56_80PIN',project_flag = 'B')

        #User.objects.get_or_create(user_name="admin",user_pwd ='d033e22ae348aeb5660fc2140aec35850c4da997')
        cloud = CollectProject.objects.filter(user_id=='1').CloudProject
        print cloud