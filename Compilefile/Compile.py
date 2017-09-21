# -*- coding: utf-8 -*-
import sys
import django
import re
import string
import os
import shutil
import threading
import json
import random
import traceback
import commands
import IR
import KP
import panel
import PQ
import tool
from normaldict import*
import updataweb 
#获取相对路径
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.extend([BASE_DIR,])
#引用Django的模块
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "zqxt_views.settings")
import django
django.setup()
from calc.models import (CloudProject,ProRemote1,ProRemote2,ProKeypad,ProPanel,ProPQ,CompileList)
#修改数据库的编译的状态
def editStatu(pid,statu,err):
    if statu == '2' or statu == '3':#如果statu等于2或者3则删除在编译队列中的序列
        CompileList.objects.filter(pro_id=pid).delete()
    else :#否则更新状态
        CompileList.objects.filter(pro_id=pid).update(pro_statu=statu)
    #statu代表编译状态，err表示错误信息
    CloudProject.objects.filter(id=pid).update(build_status=statu,compile_err=err)
#获取编译队列
def ReadCompileList():
    pid = list(CompileList.objects.filter(pro_statu='0').values('pro_id'))
    if (pid) :
        ret = pid[0]['pro_id']
    else :
        ret = False 
    #返回获取编译的项目编号
    return ret
#获取当前编译文件的配置    
def LoadProjectObject(project_id):
    CompileProject = CloudProject.objects.get(id=project_id)
    if (CompileProject != None):
        ret = CompileProject
    else:
        ret = False
    #返回编译的项目对象
    return ret
#编译customerConfig.h的替换文件
def WriteNormalConfig(CloudProject,f):
    #板型
    f.write("/*--------NormalConfig---------*/"+'\n') 
    if CloudProject.project_flag == 'MV56_RL':
        board = border_80PIN_model[CloudProject.board_type].replace('PROJ ?= R2','BD').replace('_BLOADER','')
    elif CloudProject.project_flag == 'MV56_128PIN':
        board = select_board(CloudProject.board_type)
    elif CloudProject.project_flag == 'MV56_80PIN':
        board = CloudProject.board_type
    f.write("#define MS_BOARD_TYPE_SEL %s"%(board)+"\n") 
    f.write("/* TV制式 */"+'\n')
    f.write("#undef ENABLE_NTSC_SYSTEM"+"\n")
    if (CloudProject.tv_system == "NTSC"):
        f.write("#define ENABLE_NTSC_SYSTEM  ENABLE"+"\n")
    else:
        f.write("#define ENABLE_NTSC_SYSTEM  DISABLE"+"\n")
    f.write("/* 上电记忆 */"+'\n')
    if (CloudProject.power_on_mode == u"上电开机"):
        f.write("#define DEFAULT_POWERON_MODE POWERON_MODE_ON"+"\n")
    elif (CloudProject.power_on_mode == u"上电待机"):
        f.write("#define DEFAULT_POWERON_MODE POWERON_MODE_OFF"+"\n")
    elif (CloudProject.power_on_mode == u"断电记忆"):
        f.write("#define DEFAULT_POWERON_MODE POWERON_MODE_SAVE"+"\n")
    f.write("/* 无信号雪花 */"+'\n')
    if(CloudProject.no_signal_blue == "1"):
        f.write("#define ENABLE_TV_NOSIGNAL_SNOWSCREEN ENABLE"+"\n")
    else :
        f.write("#define ENABLE_TV_NOSIGNAL_SNOWSCREEN DISABLE"+"\n")
    f.write("/* 切台镜像 */"+'\n')
    if(CloudProject.free_panel == "1"):
        f.write("#define ENABLE_SW_CH_FREEZE_SCREEN ENABLE"+"\n")
    else:
        f.write("#define ENABLE_SW_CH_FREEZE_SCREEN DISABLE"+"\n")
    f.write("/* 默认关logo  */"+'\n')
    if(CloudProject.logo_enable == "1"):
        f.write("#define UNDISPLAY_FIRST_LOGO DISABLE"+"\n")
    else:
        f.write("#define UNDISPLAY_FIRST_LOGO ENABLE"+"\n")
    f.write("#define ENABLE_MPLAYER_CAPTURE_LOGO ENABLE"+'\n')
    f.write("#define DISPLAY_LOGO ENABLE"+'\n')
    if(CloudProject.logo != ''):
        f.write("#define LOGO_TYPE LOGO_AOTO"+'\n')
    else:
        f.write("#define LOGO_TYPE LOGO_BLACK"+'\n')
    #不常用配置
    f.write("/* 倒屏  */"+'\n')
    if(CloudProject.mirro_panel == "1"):
        f.write("#define ENABLE_PANEL_MIRROR ENABLE"+'\n')
    else :
        f.write("#define ENABLE_PANEL_MIRROR DISABLE"+'\n')
    f.write("/* 背光默认值  */"+'\n')
    f.write("#define DEFAULT_BACKLIGHT %s"%(CloudProject.default_backlight)+"\n")
    f.write("/* 语言  */"+'\n')
    f.write("/* 特殊需求 */"+'\n')
    #游戏
    if CloudProject.game == '1': 
        f.write("#define ENABLE_OSD_GAME ENABLE"+"\n")
        #f.write("#define ENABLE_GAME_IN_SOURCE_MENU ENABLE"+"\n")
    else:
        f.write("#define ENABLE_OSD_GAME DISABLE"+"\n")
        #f.write("#define ENABLE_GAME_IN_SOURCE_MENU DISABLE"+"\n")
    #新菜单
    if CloudProject.new_menu == '1': 
        f.write("#define ENABLE_NEW_OSD ENABLE"+"\n")
    else:
        f.write("#define ENABLE_NEW_OSD DISABLE"+"\n")
    #双U互拷
    if CloudProject.tow_u_copy == '1': 
        f.write("#define ENABLE_COPY_PASTE ENABLE"+"\n")
    else:
        f.write("#define ENABLE_COPY_PASTE DISABLE"+"\n")
    #USB断电记忆
    if CloudProject.usb_last_memory == '1': 
        f.write("#define ENABLE_LAST_MEMORY_HAD_MOVIERESUME_MENU_EXIST ENABLE"+"\n")
        f.write("#define ENABLE_LAST_MEMORY_AUTOPLAY ENABLE"+"\n")
    else:
        f.write("#define ENABLE_LAST_MEMORY_HAD_MOVIERESUME_MENU_EXIST DISABLE"+"\n")
        f.write("#define ENABLE_LAST_MEMORY_AUTOPLAY DISABLE"+"\n")
    #电量显示
    if CloudProject.show_power == '1': 
        f.write("#define ENABLE_SHOW_POWER ENABLE"+"\n")
    else:
        f.write("#define ENABLE_SHOW_POWER DISABLE"+"\n")
    #多媒体显示USB
    if CloudProject.dmp_show == '1': 
        f.write("#define ENABLE_DMP_NAME_USB ENABLE"+"\n")
    else:
        f.write("#define ENABLE_DMP_NAME_Media ENABLE"+"\n")
    v = CloudProject.language
    ar = v.split(',')
    for r in ar:
        str = "#define "+language_list[r][0]+"  ENABLE"
        f.write(str+"\n")
    f.write("/* 默认语言  */"+'\n')
    r = CloudProject.default_language
    str = "#define DEFAULT_OSD_LANGUAGE "+language_list[r][1]
    f.write(str+"\n")
    #遥控配置
    IR.WriteIRConfig(CloudProject,f)
    #按键配置
    KP.WriteKeyPadConfig(CloudProject,f)
    #屏参配置
    panel.WritePanelConfig(CloudProject,f)
    #PQ配置
    PQ.WritePQConfig(CloudProject,f)

def WriteCustomerConfig(CloudProject):
    #新建配置文件
    file_PATH = '%s/media/configtxt/%s.h'%(BASE_DIR,CloudProject.id)
    f = open(file_PATH,'w')
    # temp=dd(CloudProject.pq_name)
    # for key in temp :configtxt/media/configtxt/%(CloudProject.id)
    #     f.write(temp[key]+'\n')
    WriteNormalConfig(CloudProject,f)
    f.close()
    #判断是否为RL，并用RJ的代码编译RL
    if CloudProject.project_flag == 'MV56_RL':
        flag = 'MV56_80PIN'
    else :
        flag = CloudProject.project_flag
    mkpath = filepath(flag)
    if os.path.isfile(mkpath['dstfile']):
        os.remove(mkpath['dstfile'])
    #替换代码中的customerConfig编译文件
    cmd = "cp -a %s %s"%(file_PATH,mkpath['dstfile'])
    print cmd
    os.system(cmd)
    #替换LOGO
    if CloudProject.logo!='':
        logo_PATH = '%s/media/%s'%(BASE_DIR,CloudProject.logo)
        if os.path.isfile(mkpath['LogoFile']):
            os.remove(mkpath['LogoFile'])
        cmd = "cp -a %s %s"%(logo_PATH,mkpath['LogoFile'])
        os.system(cmd)
    WriteConfigBoreder(mkpath['configfile'],CloudProject.project_flag,CloudProject.board_type)
    f = open(mkpath['chgfile'],'w+')
    f.truncate()
    f.close()

    cmdstr = "cd %s; %s/mk.sh"%(mkpath['mkfile'],mkpath['mkfile'])
    (status,output) = commands.getstatusoutput(cmdstr)
    upfile = False;
    err = ''
    if status == 0:
        upfile=updataweb.updata(mkpath['chgfile'],BASE_DIR,CloudProject).fname
        statu = '2'
        print 'ok'
    else :
        statu = '3'
        print 'err'
        f = open(mkpath['errFile'],"r")  
        err = f.readlines()
    if (upfile) :
        CompileUp(CloudProject.id,upfile)
    else :
        statu = '3'
        err = '文件上传失败！！！'
    editStatu(CloudProject.id,statu,err)
#把上传的文件路径存入数据库
def CompileUp(pid,upfile):
    CloudProject.objects.filter(id=pid).update(project_file=upfile)

def WriteConfigBoreder(url,flag,board_type):
    f=open(url,'r+')
    flist=f.readlines()
    if(flag=='MV56_80PIN'):
        flist[1]='%s\n'%border_80PIN_model[board_type]
    elif flag == 'MV56_128PIN':
        flist[1]='%s\n'%border_128PIN_model[board_type]
    elif flag == 'MV56_RL':
        flist[1] = '%s\n'%border_80PIN_model[board_type]
    f=open(url,'w+')
    f.writelines(flist)
#开始扫描数据库
def CompileProjectTask():
    #print "zhengcong"
    project_id = ReadCompileList()
    if project_id != False:
        ret = LoadProjectObject(project_id)
        editStatu(project_id,'1','')
        if(ret):
            print "OK"
            try:
                WriteCustomerConfig(ret)
            except Exception as e:
                print(repr(e))
                editStatu(project_id,'3',repr(e))
        else:
            raise Exception("读取数据库失败")
    timer = threading.Timer(5, CompileProjectTask)
    timer.start()
    
timer = threading.Timer(5, CompileProjectTask)
timer.start()