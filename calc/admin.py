# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin
from .models import User,CloudProject,ProjectConfig,BoardConfig,LanguageConfig,SystemConfig,CloudPanel,CloudKeypad,CloudIR,CloudPQ,ProPQ,CollectProject,logo,power,CompileList


# Register your models here.
# admin.site.register(calc.UserManage)


#admin.site.register(User)
#admin.site.register(CloudProject)
admin.site.register(ProjectConfig)
admin.site.register(BoardConfig)
admin.site.register(LanguageConfig)
admin.site.register(SystemConfig)
admin.site.register(CloudPanel)
admin.site.register(CloudIR)
admin.site.register(CloudPQ)
admin.site.register(ProPQ)
admin.site.register(CollectProject)
admin.site.register(logo)
admin.site.register(power)
admin.site.register(CompileList)


class UserAdmin(admin.ModelAdmin):
    list_display=('id','user_name','comment','user_time','user_author')
    search_fields=('id','user_name','comment')
    list_filter=('user_company',)

class ProAdmin(admin.ModelAdmin):
    list_display=('id','project_flag','board_type','default_language','projectTime')
    search_fields=('id','board_type','default_language')
    list_filter=('project_flag',)

class KeypadAdmin(admin.ModelAdmin):
    list_display=('id','keypad_name','KeypadTime')
    search_fields=('id','keypad_name','KeypadTime')
    list_filter=('keypad_is_5key_mode',)

admin.site.register(User,UserAdmin)
admin.site.register(CloudProject,ProAdmin)
admin.site.register(CloudKeypad,KeypadAdmin)

#,'用户表','项目表','项目类型','版型','语言','制式','屏参','按键','遥控','PQ','项目PQ','收藏的项目','基础LOGO'