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
import Queue
import traceback
from tool import*
from normaldict import* 

def WriteIRConfig(CloudProject,f):
    f.write("/* 遥控  */"+'\n')
    f.write("#define FACTORY_IR_TYPE_SEL FACTORY_IR_TYPE_NULL"+"\n")
    f.write("#define IR_TYPE_SEL IR_AOTO"+"\n")
    f.write("/* 主遥控  */"+'\n')
    f.write("#if IR_TYPE_SEL == IR_AOTO"+"\n")
    IR = dd(CloudProject.frist_remote)
    f.write("#define IR_SYSTEMCODE 0x%s"%(IR['remote_head_code'])+"\n")
    f.write("#define IR_HEADER_CODE0 (IR_SYSTEMCODE>>8)"+"\n")
    f.write("#define IR_HEADER_CODE1 (IR_SYSTEMCODE&0xFF)"+"\n")
    IR['IRKEY_FACTORY_MAINMENU']=''
    IR['IRKEY_FACTORY_AGING']=''
    IR['IRKEY_FACTORY_SWINFO']=''
    IR['IRKEY_FACTORY_ADC']=''
    temp_keylist = IRlist()
    for key in IR:
        if(key != 'remote_head_code' and key != 'remote_name' and key != 'id'):
            r = key.replace('remote','IRKEY')
            r = r.upper()
            if "use_as" in key :
                r = r.replace("IRKEY","IR")
                if IR[key] == '1':
                    r = "#define %s %s"%(r,"ENABLE")
                else :
                    r = "#define %s %s"%(r,"DISABLE")
                f.write(r+"\n")
            elif key == 'remote_header_code_time':
                r = r.replace("IRKEY","IR")
                r = "#define %s %s"%(r,IR[key])
                f.write(r+"\n")
            elif IR[key] != '':
                temp = "0x"+IR[key].lower()
                r = "#define "+r+" %s"%temp
                temp_keylist.remove(temp)
                f.write(r+'\n')
    for key in IR:
        if(key != 'remote_head_code' and key != 'remote_name' and key != 'id'):
            r = key.replace('remote','IRKEY')
            r = r.upper()
            if "use_as" in key :
                print 1
            elif IR[key] == '':
                temp = temp_keylist[0]
                r = "#define "+r+" %s"%temp
                temp_keylist.remove(temp)
                f.write(r+'\n')

    f.write("/* 副遥控  */"+'\n')
    f.write("#endif"+"\n")