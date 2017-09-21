# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import sys
import django
if django.VERSION >= (1, 7):#自动判断版本
    django.setup()

reload(sys)
sys.setdefaultencoding('utf-8')

from django.shortcuts import render,render_to_response
from .models import User,CloudProject,ProjectConfig,BoardConfig,LanguageConfig,SystemConfig,CloudPQ,CloudIR,CloudKeypad,CloudPanel,ProRemote1,ProRemote2,ProKeypad,ProPanel,ProPQ,CollectProject,CollectPanel,CollectKeypad,CollectIR,CollectPQ,logo,Collectlogo,power,CompileList
from django.http import HttpResponse,StreamingHttpResponse
from django.core import serializers
from django.core.files.storage import default_storage
from django.conf import settings
from django.core.files.base import ContentFile
from django import forms
from django.db.models import Q
import os
import json
import datetime  
import re,math
import Config

# from Compile import*
from tool import*

try:
    from django.http import JsonResponse
except ImportError:
    from .tool import JsonResponse

def index(request):
    return render(request,'index.html')

def mianze(request):
    return render(request,'mianze.html')

def login_check(request):
    name = request.GET.get('uName')
    pwd  = request.GET.get('uPwd')
    uid = list(User.objects.filter(user_name=name,user_pwd=pwd).values('id','comment','user_icon','user_author','user_language'))
    if (uid):
        login_ok = uid
    else:
        login_ok = 'err'

    return HttpResponse(json.dumps(login_ok),content_type = 'application/json')

def selectLg(request):
    uid = request.POST.get('uid')
    language = request.POST.get('val')
    s = User.objects.filter(id=uid).update(user_language=language)
    t = 'err'
    if(s):
        t = 'ok'
    return HttpResponse(t);




  
class CJsonEncoder(json.JSONEncoder):  
    def default(self, obj):  
        if isinstance(obj, datetime.datetime):  
            return obj.strftime('%Y-%m-%d %H:%M:%S')  
        elif isinstance(obj, date):  
            return obj.strftime("%Y-%m-%d")  
        else:  
            return json.JSONEncoder.default(self, obj)  

def pages(request):
    table = request.GET.get('table')
    uid = request.GET.get('uid')
    col = request.GET.get('col')
    ser = request.GET.get('serch')
    sel = dict()
    serch = dict()
    if ser != '':
        ser = re.split(':',ser)
        if col != '1' or ser[0] == 'id':
            serch[ser[0]+'__icontains']=ser[1]
        else :
            p = ''
            if table == 'pro':
                p = 'pro_id__'
            if table == 'btn':
                p = 'keypad_id__'
            if table == 'rmt':
                p = 'ir_id__'
            if table == 'pc':
                p = 'panel_id__'
            if table == 'pq':
                p = 'pq_id__'
            if tid == 'logo':
                p = 'logo_id__'
            serch[p+ser[0]+'__icontains']=ser[1]
    if uid != 'all':
        sel['Author']=uid
    if table == 'pro':
        if col!='1':
            num = int(math.ceil(float(CloudProject.objects.filter(Q(**serch),**sel).count())/20))
        else :
            num = int(math.ceil(float(CollectProject.objects.filter(Q(**serch),Q(uid=uid)|Q(colAll='1')).count())/20))
    if table == 'btn':
        if col!='1':
            num = int(math.ceil(float(CloudKeypad.objects.filter(Q(**serch),**sel).count())/20))
        else :
            num = int(math.ceil(float(CollectKeypad.objects.filter(Q(**serch),Q(uid=uid)|Q(colAll='1')).count())/20))
    if table == 'rmt':
        if col!='1':
            num = int(math.ceil(float(CloudIR.objects.filter(Q(**serch),**sel).count())/20))
        else :
            num = int(math.ceil(float(CollectIR.objects.filter(Q(**serch),Q(uid=uid)|Q(colAll='1')).count())/20))
    if table == 'pc':
        if col!='1':
            num = int(math.ceil(float(CloudPanel.objects.filter(Q(**serch),**sel).count())/20))
        else :
            num = int(math.ceil(float(CollectPanel.objects.filter(Q(**serch),Q(uid=uid)|Q(colAll='1')).count())/20))
    if table == 'pq':
        if col!='1':
            num = int(math.ceil(float(CloudPQ.objects.filter(Q(**serch),**sel).count())/20))
        else :
            num = int(math.ceil(float(CollectPQ.objects.filter(Q(**serch),Q(uid=uid)|Q(colAll='1')).count())/20))
    if table == 'logo':
        if col!='1':
            num = int(math.ceil(float(logo.objects.filter(Q(**serch),**sel).count())/20))
        else :
            num = int(math.ceil(float(Collectlogo.objects.filter(Q(**serch),Q(uid=uid)|Q(colAll='1')).count())/20))
    return HttpResponse(num)

def projectList(request):
    order_mode = request.GET.get('sort')
    num = int(request.GET.get('page'))
    uid = request.GET.get('uid')
    col = request.GET.get('col')
    ser = request.GET.get('serch')
    tid = request.GET.get('id')
    sel = dict()
    serch = dict()
    if ser != '':
        ser = re.split(':',ser)
        if col == '' or ser[0] == 'id':
            serch[ser[0]+'__icontains']=ser[1]
        else :
            p = ''
            if tid == 'pro':
                p = 'pro_id__'
            if tid == 'btn':
                p = 'keypad_id__'
            if tid == 'rmt':
                p = 'ir_id__'
            if tid == 'pc':
                p = 'panel_id__'
            if tid == 'pq':
                p = 'pq_id__'
            if tid == 'logo':
                p = 'logo_id__'
            serch[p+ser[0]+'__icontains']=ser[1]
    order_start = (num-1)*20
    order_end = num*20
    if tid == 'pro':
        if col == '':
            if uid != 'all':
                sel['Author']=uid
            cloud = list(CloudProject.objects.filter(Q(**serch),**sel)\
                                .order_by(order_mode)[order_start:order_end]\
                                .values('id','project_flag','board_type','panel_name__panel_name',
                                    'default_language','frist_remote__remote_name','keypad_name__keypad_name',
                                    'build_status','projectTime','Author__comment','project_file'))
        else :
            cloud = list(CollectProject.objects.filter(Q(**serch),Q(uid=uid)|Q(colAll='1'))\
                    .order_by('-colAll',order_mode)[order_start:order_end]\
                    .values('id','pro_id__project_flag','pro_id__board_type','pro_id__panel_name__panel_name',
                        'pro_id__default_language','pro_id__frist_remote__remote_name','pro_id__keypad_name__keypad_name',
                        'pro_id__build_status','pro_id__projectTime','pro_id__Author__comment','pro_id__project_file','colAll'))
    if tid == 'btn':
        if col == '':
            if uid != 'all':
                sel['Author']=uid
            cloud = list(CloudKeypad.objects.filter(Q(**serch),**sel)\
                                .order_by(order_mode)[order_start:order_end]\
                                .values('id','keypad_name','keypad_is_5key_mode','keypad_k0','keypad_k1','keypad_k2','keypad_k3','keypad_k4','keypad_k5','keypad_k6','KeypadTime','Author__comment'))


        else :
            cloud = list(CollectKeypad.objects.filter(Q(**serch),Q(uid=uid)|Q(colAll='1'))\
                        .order_by('-colAll',order_mode)[order_start:order_end]\
                        .values('id','keypad_id__keypad_name','keypad_id__keypad_is_5key_mode','keypad_id__keypad_k0','keypad_id__keypad_k1','keypad_id__keypad_k2','keypad_id__keypad_k3','keypad_id__keypad_k4','keypad_id__keypad_k5','keypad_id__keypad_k6','keypad_id__KeypadTime','keypad_id__Author__comment','colAll'))
    if tid == 'rmt':
        if col == '':
            if uid != 'all':
                sel['Author']=uid
            cloud = list(CloudIR.objects.filter(Q(**serch),**sel)\
                                .order_by(order_mode)[order_start:order_end]\
                                .values('id','remote_name','remote_head_code','IRTime','Author__comment'))


        else :
            cloud = list(CollectIR.objects.filter(Q(**serch),Q(uid=uid)|Q(colAll='1'))\
                                .order_by('-colAll',order_mode)[order_start:order_end]\
                                .values('id','ir_id__remote_name','ir_id__remote_head_code','ir_id__IRTime','ir_id__Author__comment','colAll'))
    if tid == 'pc':
        if col == '':
            if uid != 'all':
                sel['Author']=uid
            cloud = list(CloudPanel.objects.filter(Q(**serch),**sel)\
                                .order_by(order_mode)[order_start:order_end]\
                                .values('id','panel_name','PanelTime','Author__comment'))


        else :
            cloud = list(CollectPanel.objects.filter(Q(**serch),Q(uid=uid)|Q(colAll='1'))\
                              .order_by('-colAll',order_mode)[order_start:order_end]\
                              .values('id','panel_id__panel_name','panel_id__PanelTime','panel_id__Author__comment','colAll'))
    if tid == 'pq':
        if col == '':
            if uid != 'all':
                sel['Author']=uid
            cloud = list(CloudPQ.objects.filter(Q(**serch),**sel)\
                                .order_by(order_mode)[order_start:order_end]\
                                .values('id','pq_name','PQTime','Author__comment'))


        else :
            cloud = list(CollectPQ.objects.filter(Q(**serch),Q(uid=uid)|Q(colAll='1'))\
                                  .order_by('-colAll',order_mode)[order_start:order_end]\
                                  .values('id','pq_id__pq_name','pq_id__PQTime','pq_id__Author__comment','colAll'))
    if tid == 'logo':
        if col == '':
            if uid != 'all':
                sel['Author']=uid
            cloud = list(logo.objects.filter(Q(**serch),**sel)\
                                .order_by(order_mode)[order_start:order_end]\
                                .values('id','logo_name','logo_src','LOGOTime','Author__comment'))


        else :
            cloud = list(Collectlogo.objects.filter(Q(**serch),Q(uid=uid)|Q(colAll='1'))\
                                  .order_by('-colAll',order_mode)[order_start:order_end]\
                                  .values('id','logo_id__logo_name','logo_id__logo_src','logo_id__LOGOTime','logo_id__Author__comment','colAll'))
    return HttpResponse(json.dumps(cloud),content_type = 'application/json')
    #return HttpResponse(json.dumps(ser),content_type = 'application/json')

def getlogo(list):
    logolist = []
    for k in range(len(list)):
        logo = {}
        for key in list[k]:
            ke = key.replace('logo_id__','')
            logo.setdefault(ke,list[k][key])
        logolist.append(logo);
    return logolist

def get_new_project_config(project_config,uid):
    h = ''
    if uid != u'all':
        tv_system_type = list(SystemConfig.objects.filter(system_flag__contains=project_config.project_flag).values_list('system_name',flat=True))
        language = list(LanguageConfig.objects.filter(language_flag__contains=project_config.project_flag).values_list('language_name',flat=True))
        board_type = list(BoardConfig.objects.filter(board_flag__contains=project_config.project_flag).values_list('board_name','board_img1','board_img2'))
        panel_name = list(CollectPanel.objects.filter(Q(uid=uid)|Q(colAll='1')).values_list('panel_id__panel_name',flat=True))
        keypad_name = list(CollectKeypad.objects.filter(Q(uid=uid)|Q(colAll='1')).values_list('keypad_id__keypad_name',flat=True))
        pq_name = list(CollectPQ.objects.filter(Q(uid=uid)|Q(colAll='1')).values_list('pq_id__pq_name',flat=True))
        frist_remote = list(CollectIR.objects.filter(Q(uid=uid)|Q(colAll='1')).values_list('ir_id__remote_name',flat=True))
        slogo = list(Collectlogo.objects.filter(Q(uid=uid)|Q(colAll='1')).values('logo_id__logo_name','logo_id__logo_src'))
        slogo = getlogo(slogo)
        power_on_mode = list(power.objects.values_list('power_on_mode',flat=True))
    else :
        tv_system_type = list(SystemConfig.objects.filter(system_flag__contains=project_config.project_flag).values_list('system_name',flat=True))
        language = list(LanguageConfig.objects.filter(language_flag__contains=project_config.project_flag).values_list('language_name',flat=True))
        board_type = list(BoardConfig.objects.filter(board_flag__contains=project_config.project_flag).values_list('board_name','board_img1','board_img2'))
        panel_name = list(CloudPanel.objects.values_list('panel_name',flat=True))
        keypad_name = list(CloudKeypad.objects.values_list('keypad_name',flat=True))
        pq_name = list(CloudPQ.objects.values_list('pq_name',flat=True))
        frist_remote = list(CloudIR.objects.values_list('remote_name',flat=True))
        slogo = list(logo.objects.values('logo_name','logo_src'));
        power_on_mode = list(power.objects.values_list('power_on_mode',flat=True))
    new_project_config = [
        {'board_type':board_type},
        {'tv_system':tv_system_type},
        {'language':language},
        {'panel_name':panel_name},
        {'keypad_name':keypad_name},
        {'pq_name':pq_name},
        {'frist_remote':frist_remote},
        {'second_remote':frist_remote},
        {'power_on_mode':power_on_mode},
        {'logo':slogo},
        {'html':h}
    ]


    return new_project_config

def html(type):
    pro = [
        {'type':'checkbox','name':'game','text':'游戏开关','default':'0'},
        {'type':'checkbox','name':'new_menu','text':'新菜单','default':'0'},

        {'type':'checkbox','name':'tow_u_copy','text':'双U互拷','default':'0'},
        {'type':'checkbox','name':'usb_last_memory','text':'USB断电记忆','default':'0'},

        {'type':'checkbox','name':'show_power','text':'电量显示','default':'0'},
        {'type':'checkbox','name':'dmp_show','text':'多媒体显示USB','default':'0'},
    ]
    if(type == 'project'):
        h = ''
        for i in range(len(pro)):
            if pro[i]['default']=='1':
                ck = 'checked'
                a = 'active'
            else:
                ck = ' '
                a = ''
            h += '<div class="row">\
                    <div class="col-xs-1 col-sm-2"></div>\
                    <div class="col-xs-3 col-sm-2 text-right">\
                    </div>\
                    <div class="col-xs-3 col-sm-3">\
                        <div class="checkboxThree pull-left '+a+'">\
                            <label for="'+pro[i]['name']+'"><span class="glyphicon glyphicon-ok"></span></label>\
                            <input form="prolist" type="'+pro[i]['type']+'" '+ck+' value="1" id="'+pro[i]['name']+'" name="'+pro[i]['name']+'" />\
                        </div>\
                        <span class="label-title">&nbsp;&nbsp;'+pro[i]['text']+'</span>\
                    </div>\
                </div>'
            # else :
            #     h += '<div class="col-xs-3 col-sm-2 text-right">\
            #             </div>\
            #             <div class="col-xs-1 col-sm-1">\
            #                 <div class="checkboxThree pull-left '+a+'">\
            #                     <label for="'+pro[i]['name']+'"><span class="glyphicon glyphicon-ok"></span></label>\
            #                     <input form="prolist" type="'+pro[i]['type']+'" '+ck+' value="1" id="'+pro[i]['name']+'" name="'+pro[i]['name']+'" />\
            #                 </div>\
            #             </div>\
            #             <div class="col-xs-3 col-sm-2 text-right">\
            #                 <span class="label-title">'+pro[i]['text']+'</span>\
            #             </div>\
            #         '
        return h


def newProject(request):

    platename = request.POST.get('platename')

    uid = request.POST.get('uid')

    project_config = ProjectConfig.objects.get(project_name=platename)

    new_project_config = get_new_project_config(project_config,uid)

    return HttpResponse(json.dumps(new_project_config),content_type = 'application/json')

def getHtml(request):
    user = request.GET.get('user_author')
    t = request.GET.get('type')
    h = ''
    if user == '1' or user == '2' :
        h = html(t)
    return HttpResponse(h)

def addCloud(request):
    if request.method == 'POST':
        data = {}
        for key in request.POST:
            if key == 'table':
                table = request.POST.get(key)
            elif key != 'logo_src':
                val = request.POST.get(key)
                data.setdefault(key,val)
        if table == 'CloudKeypad':
            cid = CloudKeypad.objects.create(**data)
        if table == 'CloudPanel':
            cid = CloudPanel.objects.create(**data)
        if table == 'CloudIR':
            cid = CloudIR.objects.create(**data)
        if table == 'CloudPQ':
            cid = CloudPQ.objects.create(**data)
        if table == 'logo':
            src = request.FILES.get('logo_src')
            data.setdefault('logo_src',src)
            cid = logo.objects.create(**data)
    return HttpResponse('ok')

def testName(request):
    if request.method == 'POST':
        table = request.POST.get('SQL')
        name = request.POST.get('name')
        cos = None
        if table == 'CloudKeypad':
            cos = CloudKeypad.objects.filter(keypad_name=name).values('id')
        if table == 'CloudPanel':
            cos = CloudPanel.objects.filter(panel_name=name).values('id')
        if table == 'CloudIR':
            cos = CloudIR.objects.filter(remote_name=name).values('id')
        if table == 'CloudPQ':
            cos = CloudPQ.objects.filter(pq_name=name).values('id')
        if table == 'logo':
            cos = logo.objects.filter(logo_name=name).values('id')
        if(cos):
            test = 'err'
        else:
            test = 'yes'
        return HttpResponse(test)
def editPei(request):
    if request.method == 'POST':
        data = {}
        for key in request.POST:
            if key == 'table':
                table = request.POST.get(key)
            elif key == 'tname':
                ttname = request.POST.get(key)
            elif key == 'logo_src':
                logo_src = request.FILES.get(key)
                data.setdefault(key,logo_src)
            else:
                val = request.POST.get(key)
                data.setdefault(key,val)
        if table == 'CloudKeypad':
            cid = CloudKeypad.objects.filter(id=ttname).update(**data)
        if table == 'CloudPanel':
            cid = CloudPanel.objects.filter(id=ttname).update(**data)
        if table == 'CloudIR':
            cid = CloudIR.objects.filter(id=ttname).update(**data)
        if table == 'CloudPQ':
            cid = CloudPQ.objects.filter(id=ttname).update(**data)
        if table == 'logo':
            cid = logo.objects.filter(id=ttname).update(**data)
    return HttpResponse('ok')

def custom(request):
    l = {}
    table = request.GET.get('SQL')
    name = request.GET.get('Rname')
    if table == 'CloudKeypad':
        cloud_custom = CloudKeypad.objects.get(keypad_name=name)
    elif table == 'CloudIR' or table == 'fu-remote':
        cloud_custom = CloudIR.objects.get(remote_name=name)
    elif table == 'CloudPanel':
        cloud_custom = CloudPanel.objects.get(panel_name=name)
    elif table == 'CloudPQ':
        cloud_custom = CloudPQ.objects.get(pq_name=name)
    elif table == 'logo':
        cloud_custom = logo.objects.get(logo_name=name)
    else :
        return HttpResponse('no')
    cloud_custom = cloud_custom.__dict__
    for key in cloud_custom:
        if key != '_state' and key != 'Author_id':
            l[key] = cloud_custom[key]
    return HttpResponse(json.dumps(l),content_type = 'application/json')

def addPro(request):
    if request.method == 'POST':
        pro_form = {}
        remote1 = {}
        remote2 = {}
        keypad = {}
        panel = {}
        PQ = {}
        uid = request.POST.get('user_id')
        logo = request.FILES.get('logo')
        if logo == None :
            logo = request.POST.get('logo')
        for key in request.POST:
            ke = re.findall(r"\[(.+?)\]",key)
            if 'prolist' in key:
                val = request.POST.get(key)
                pro_form.setdefault(ke[0],val)
            if 'remote1' in key:
                val = request.POST.get(key)
                remote1.setdefault(ke[0],val)
            if 'remote2' in key:
                val = request.POST.get(key)
                remote2.setdefault(ke[0],val)
            if 'Keypad' in key:
                val = request.POST.get(key)
                keypad.setdefault(ke[0],val)
            if 'Panel' in key:
                val = request.POST.get(key)
                panel.setdefault(ke[0],val)
            if 'CloudPQ' in key:
                val = request.POST.get(key)
                PQ.setdefault(ke[0],val)
        pro_form.setdefault('Author_id',uid)
        pro_form.setdefault('logo',logo)
        r1_id = ProRemote1.objects.create(**remote1)
        r2_id = ProRemote2.objects.create(**remote2)
        key_id = ProKeypad.objects.create(**keypad)
        panel_id = ProPanel.objects.create(**panel)
        pq_id = ProPQ.objects.create(**PQ)
        pro_form.setdefault('frist_remote_id',int(r1_id.id))
        pro_form.setdefault('second_remote_id',int(r2_id.id))
        pro_form.setdefault('keypad_name_id',int(key_id.id))
        pro_form.setdefault('panel_name_id',int(panel_id.id))
        pro_form.setdefault('pq_name_id',int(pq_id.id))
        project_id=CloudProject.objects.create(**pro_form)
        #pid = CloudProject.objects.get(id=3)

        CompileList.objects.create(pro_id = project_id.id)
        
        return HttpResponse('ok')

def login(request):
    #usr = User(user_name='admin',user_pwd='d033e22ae348aeb5660fc2140aec35850c4da997')
    #usr.save()
    # language =  LanguageConfig(language_name=u'英语',language_flag='A')    
    # language.save()
    
    #ProjectConfig.objects.get_or_create(project_name="MV56_80PIN",project_flag='A')
    #ProjectConfig.objects.get_or_create(project_name="MV56_128PIN",project_flag='B')
    # ProjectConfig.objects.get_or_create(project_name="ZVT_MV56RJU_C",project_flag='A')
    # ProjectConfig.objects.get_or_create(project_name="ZVT_MV56RJU_D",project_flag='A')
    # ProjectConfig.objects.get_or_create(project_name="ZVT_MV56RUU_A8",project_flag='B')
    # ProjectConfig.objects.get_or_create(project_name="ZVT_MV56RUU_B",project_flag='B')
    # ProjectConfig.objects.get_or_create(project_name="ZVT_MV56RUU_C",project_flag='B')
    # ProjectConfig.objects.get_or_create(project_name="ZVT_MV56RUU_D",project_flag='B')
    # 
    #LanguageConfig.objects.get_or_create(language_name="英语")
    #LanguageConfig.objects.get_or_create(language_name="法语")
    #ProjectConfig.objects.filter(project_flag='A').delete()
    #ProjectConfig.objects.filter(project_flag='B').delete()
    #User.objects.get_or_create(user_name="admin",user_pwd ='d033e22ae348aeb5660fc2140aec35850c4da997')
    return render(request,'login.html')
def delet(request):
    table = request.POST.get('SQL')
    row = request.POST.get('row')
    col = request.POST.get('col')
    user_id = request.POST.get('uid')
    txt = 'err'
    if col=='':
        if table == 'CloudProject':
            if CloudProject.objects.filter(id=row).delete() and CompileList.objects.filter(pro_id=row).delete():
                txt = 'ok'
        if table == 'CloudKeypad':
            if CloudKeypad.objects.filter(id=row).delete():
                txt = 'ok'
        if table == 'CloudPanel':
            if CloudPanel.objects.filter(id=row).delete():
                txt = 'ok'
        if table == 'CloudIR':
            if CloudIR.objects.filter(id=row).delete():
                txt = 'ok'
        if table == 'CloudPQ':
            if CloudPQ.objects.filter(id=row).delete():
                txt = 'ok'
        if table == 'logo':
            if logo.objects.filter(id=row).delete():
                txt = 'ok'
    elif col=='1' :
        if table == 'CloudProject':
            if CollectProject.objects.filter(id=row,uid=user_id).delete():
                txt = 'ok'
        if table == 'CloudKeypad':
            if CollectKeypad.objects.filter(id=row,uid=user_id).delete():
                txt = 'ok'
        if table == 'CloudPanel':
            if CollectPanel.objects.filter(id=row,uid=user_id).delete():
                txt = 'ok'
        if table == 'CloudIR':
            if CloudIR.objects.filter(id=row,uid=user_id).delete():
                txt = 'ok'
        if table == 'CloudPQ':
            if CollectPQ.objects.filter(id=row,uid=user_id).delete():
                txt = 'ok'
        if table == 'logo':
            if Collectlogo.objects.filter(id=row,uid=user_id).delete():
                txt = 'ok'
    return HttpResponse(txt)
def addcol(request):
    table = request.POST.get('SQL')
    cid = request.POST.get('id')
    user_id = request.POST.get('uid')
    txt = 'ok'
    if table == 'CloudProject':
        CollectProject.objects.get_or_create(uid=user_id,pro_id_id=cid)
    if table == 'CloudPanel':
        CollectPanel.objects.get_or_create(uid=user_id,panel_id_id=cid)
    if table == 'CloudKeypad':
        CollectKeypad.objects.get_or_create(uid=user_id,keypad_id_id=cid)
    if table == 'CloudIR':
        CollectIR.objects.get_or_create(uid=user_id,ir_id_id=cid)
    if table == 'CloudPQ':
        CollectPQ.objects.get_or_create(uid=user_id,pq_id_id=cid)
    if table == 'logo':
        Collectlogo.objects.get_or_create(uid=user_id,logo_id_id=cid)
    return HttpResponse(txt)
def RuPwd(request):
    uid = request.POST.get('user_id')
    upwd = request.POST.get('user_pwd')
    if (User.objects.filter(id = uid).update(user_pwd = upwd)):
        txt = 'ok'
    else :
        txt = 'err'
    return HttpResponse(txt)
    
def RIcon(request):
    uid = request.POST.get('user_id')
    uicon = request.FILES.get('user_icon')
    if uicon == None :
        photoname = request.POST.get('user_icon')
    else:
        photoname='Images/user/jdface/%s/%s'%(uid,uicon.name)
        path = default_storage.save(photoname,ContentFile(uicon.read()))
        tmp_file = os.path.join(settings.MEDIA_ROOT,path)
    if (User.objects.filter(id = uid).update(user_icon=photoname)):
        txt = 'ok'
    else :
        txt = 'err'
    return HttpResponse(txt)

def getUser(request):
    uid = request.POST.get('user_id')
    cloud = list(User.objects.filter(id = uid).values('user_name','comment','user_company','user_telphone','user_time'))
    return HttpResponse(json.dumps(cloud),content_type = 'application/json')
def upLogo(request):
    image = request.FILES.get('image')
    name = request.POST.get('uname')
    time = request.POST.get('time')
    path = default_storage.save('logo/userImg/'+name+'/'+time+image.name,ContentFile(image.read()))
    tmp_file = os.path.join(settings.MEDIA_ROOT,path)
    return HttpResponse('ok')


    
#查看项目
def lookPro(request):
    cloud = {}
    pid = request.GET.get('pid')
    pro = list(CloudProject.objects.filter(id=pid).values('board_type','tv_system','power_on_mode',
        'language','default_language','mirro_panel','logo_name','logo','logo_enable','no_signal_blue',
        'free_panel','default_backlight','game','pq_name__pq_name','panel_name__panel_name',
        'keypad_name__keypad_name','second_remote__remote_name','frist_remote__remote_name',
        'new_menu','tow_u_copy','usb_last_memory','show_power','dmp_show'))
    p = CloudProject.objects.get(id=pid)#.value('frist_remote','second_remote','keypad_name','panel_name','pq_name')
    board_img = BoardConfig.objects.get(board_name=p.board_type)
    IR1 = ProRemote1.objects.get(id=int(p.frist_remote.id))
    IR2 = ProRemote2.objects.get(id=int(p.second_remote.id))
    keypad = ProKeypad.objects.get(id=int(p.keypad_name.id))
    pl = ProPanel.objects.get(id=int(p.panel_name.id))
    pq = ProPQ.objects.get(id=int(p.pq_name.id))
    cloud = {}
    cloud['pro'] = pro[0]
    cloud['board'] = dd(board_img)
    cloud['CloudIR'] = dd(IR1)
    cloud['fu-remote'] = dd(IR2)
    cloud['CloudKeypad'] = dd(keypad)
    cloud['CloudPanel'] = dd(pl)
    cloud['CloudPQ'] = dd(pq)
    return HttpResponse(json.dumps(cloud),content_type = 'application/json')

#查看项目按键
def GetProkeypad(request):
    pid = request.GET.get('pid')
    key = list(CloudProject.objects.filter(id=pid).values('keypad_name__keypad_k0','keypad_name__keypad_k1',
        'keypad_name__keypad_k2','keypad_name__keypad_k3','keypad_name__keypad_k4','keypad_name__keypad_k5','keypad_name__keypad_k6',))
    return HttpResponse(json.dumps(key),content_type = 'application/json')

#获取批量下载的路径
def savelist(request):
    pid = request.POST.getlist('pid[]');
    uid = request.POST.get('col');
    pidlist = ','.join(pid)
    if uid != '':
        f = list(CollectProject.objects.extra(where=['id IN ('+ pidlist +')']).values('pro_id'))
        pidlist = ''
        for key in f:
            pidlist = "%s,%s"%(pidlist,key['pro_id'])
        pidlist = pidlist.replace(',','',1)
    files = list(CloudProject.objects.extra(where=['id IN ('+ pidlist +')']).values('project_file'))
    return HttpResponse(json.dumps(files),content_type = 'application/json');

#批量删除
def removeList(request):
    pid = request.POST.getlist('pid[]')
    table = request.POST.get('table')
    uid = request.POST.get('col');
    pidlist = ','.join(pid)
    if table == 'pro':
        if uid == '':
            CloudProject.objects.extra(where=['id IN ('+ pidlist +')']).delete()
            CompileList.objects.extra(where=['pro_id IN ('+ pidlist +')']).delete()
        else :
            CollectProject.objects.extra(where=['id IN ('+ pidlist +')']).delete()
    if table == 'pc':
        if uid == '':
            CloudPanel.objects.extra(where=['id IN ('+ pidlist +')']).delete()
        else :
            CollectPanel.objects.extra(where=['id IN ('+ pidlist +')']).delete()
    if table == 'pq':
        if uid == '':
            CloudPQ.objects.extra(where=['id IN ('+ pidlist +')']).delete()
        else :
            CollectPQ.objects.extra(where=['id IN ('+ pidlist +')']).delete()  
    if table == 'rmt':
        if uid == '':
            CloudIR.objects.extra(where=['id IN ('+ pidlist +')']).delete()
        else :
            CollectIR.objects.extra(where=['id IN ('+ pidlist +')']).delete()
    if table == 'btn':
        if uid == '':
            CloudKeypad.objects.extra(where=['id IN ('+ pidlist +')']).delete()
        else :
            CollectKeypad.objects.extra(where=['id IN ('+ pidlist +')']).delete()
    return HttpResponse('ok');

#批量添加到星标
def colList(request):
    pid = request.POST.getlist('pid[]')
    table = request.POST.get('table')
    uid = request.POST.get('col');
    pidlist = ','.join(pid)
    pid = pidlist.split(',')
    for key in pid:
        if table == 'pro':
            CollectProject.objects.get_or_create(uid=uid,pro_id_id=key)
        if table == 'pc':
            CollectPanel.objects.get_or_create(uid=uid,panel_id_id=key)
        if table == 'pq':
            CollectPQ.objects.get_or_create(uid=uid,pq_id_id=key)
        if table == 'rmt':
            CollectIR.objects.get_or_create(uid=uid,ir_id_id=key)
        if table == 'btn':
            CollectKeypad.objects.get_or_create(uid=uid,keypad_id_id=key)
    return HttpResponse('ok');

def getProSys(request):
    procig = list(ProjectConfig.objects.values('project_name'))
    return HttpResponse(json.dumps(procig),content_type = 'application/json')

def config(request):
    if request.method == 'POST':
        data = {}
        for key in request.POST:
            if key == 'user_author':
                user_author = request.POST.get(key)
                if user_author == '3':
                    return HttpResponse('只有管理员支持')
            elif key == 'table':
                table = request.POST.get(key)
            elif key == 'logo_src':
                logo_src = request.FILES.get(key)
                data.setdefault(key,logo_src)
            else:
                val = request.POST.get(key)
                data.setdefault(key,val)
        if table == 'CloudKeypad':
            cid = Config.WriteKeyPadConfig(data)
        if table == 'CloudPanel':
            cid = Config.WritePanelConfig(data)
        if table == 'CloudIR':
            cid = Config.WriteIRConfig(data)
        if table == 'CloudPQ':
            cid = Config.WritePQConfig(data)
        if table == 'logo':
            return HttpResponse('LOGO暂不支持')
    return HttpResponse(cid)

def Download(request):
    def file_iterator(file_name, chunk_size=512):
        with open(file_name) as f:
            while True:
                c = f.read(chunk_size)
                if c:
                    yield c
                else:
                    break

    the_file_name = settings.BASE_DIR+'/'+request.GET.get('url')
    filename = the_file_name.split('/');
    filename = filename[-1]
    response = StreamingHttpResponse(file_iterator(the_file_name))
    response['Content-Type'] = 'application/octet-stream'
    response['Content-Disposition'] = 'attachment;filename="{0}"'.format(filename)

    return response

#添加或取消所有人常用
def colAll(request):
    table = request.POST.get('table')
    cid = request.POST.get('id')
    val = request.POST.get('val')
    uid = request.POST.get('uid')
    col = request.POST.get('col')
    if col == '1':
        if table == 'pro':
            s = CollectProject.objects.filter(id = cid).update(colAll=val)
        if table == 'pc':
            s = CollectPanel.objects.filter(id = cid).update(colAll=val)
        if table == 'btn':
            s = CollectKeypad.objects.filter(id = cid).update(colAll=val)
        if table == 'rmt':
            s = CollectIR.objects.filter(id = cid).update(colAll=val)
        if table == 'pq':
            s = CollectPQ.objects.filter(id = cid).update(colAll=val)
        if table == 'logo':
            s = Collectlogo.objects.filter(id = cid).update(colAll=val)
    else :
        if table == 'pro':
            CollectProject.objects.get_or_create(uid=uid,pro_id_id=cid)
            s = CollectProject.objects.filter(uid=uid,pro_id_id=cid).update(colAll=val)
        if table == 'pc':
            CollectPanel.objects.get_or_create(uid=uid,panel_id_id=cid)
            s = CollectPanel.objects.filter(uid=uid,panel_id_id=cid).update(colAll=val)
        if table == 'btn':
            CollectKeypad.objects.get_or_create(uid=uid,keypad_id_id=cid)
            s = CollectKeypad.objects.filter(uid=uid,keypad_id_id=cid).update(colAll=val)
        if table == 'rmt':
            CollectIR.objects.get_or_create(uid=uid,ir_id_id=cid)
            s = CollectIR.objects.filter(uid=uid,ir_id_id=cid).update(colAll=val)
        if table == 'pq':
            CollectPQ.objects.get_or_create(uid=uid,pq_id_id=cid)
            s = CollectPQ.objects.filter(uid=uid,pq_id_id=cid).update(colAll=val)
        if table == 'logo':
            Collectlogo.objects.get_or_create(uid=uid,logo_id_id=cid)
            s = Collectlogo.objects.filter(uid=uid,logo_id_id=cid).update(colAll=val)
    if s :
        t = 'ok'
    else:
        t = 'err'
    return HttpResponse(t)