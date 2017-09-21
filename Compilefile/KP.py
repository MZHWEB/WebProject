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

def WriteKeyPadConfig(CloudProject,f):
    f.write("/* 按键  */"+'\n')
    f.write("#define KEYPAD_TYPE_SEL KEYPAD_TYPE_AOTO"+"\n")
    KP = dd(CloudProject.keypad_name)
    flag  = False
    boardList = ['BD_ZVT_MV56RUU_G','BD_ZVT_MV56RUU_H','BD_ZVT_MV56RUU_J','BD_ZVT_MV56RJU_F','BD_ZVT_MV56RJU_G','BD_ZVT_MV56RJU_H']
    str = "#if KEYPAD_TYPE_SEL == KEYPAD_TYPE_AOTO"
    f.write(str+"\n")
    r = CloudProject.board_type
    for board in boardList:
        if r == board:
            f.write("#define ENABLE_5KEY_FUNCTION ENABLE"+"\n") 
            f.write("#define KEYPAD_G 1"+"\n") 
            f.write("#define ADC_KEY_1_L0_FLAG IRKEY_INPUT_SOURCE"+"\n") 
            f.write("#define ADC_KEY_1_L1_FLAG IRKEY_LEFT"+"\n") 
            f.write("#define ADC_KEY_1_L2_FLAG IRKEY_MENU"+"\n") 
            f.write("#define ADC_KEY_1_L3_FLAG IRKEY_RIGHT"+"\n") 
            f.write("#define ADC_KEY_1_L4_FLAG IRKEY_POWER"+"\n") 
            f.write("#define ADC_KEY_1_L5_FLAG IRKEY_DUMY"+"\n") 
            f.write("#define ADC_KEY_1_L6_FLAG IRKEY_DUMY"+"\n") 
            f.write("#define ADC_KEY_1_L7_FLAG IRKEY_DUMY"+"\n")
            flag = True
            break
    if flag != True:
        if KP['keypad_is_5key_mode'] == '1':
            f.write("#define ENABLE_5KEY_FUNCTION ENABLE"+"\n")
        else :
            f.write("#define ENABLE_5KEY_FUNCTION DISABLE"+"\n")
        f.write("#define KEYPAD_G 0"+"\n")
        i = 0
        for key in KP :
            if (key != 'keypad_is_5key_mode') or (key != 'keypad_name'):
                if(KP['keypad_k%s'%i]==''):
                    str = "#define ADC_KEY_1_L%s_FLAG IRKEY_DUMY"%i
                else:
                    str = "#define ADC_KEY_1_L%s_FLAG IRKEY_"%i+keypad[KP['keypad_k%s'%i]]
                f.write(str+"\n")
                if i < 6:
                    i = i + 1
                else :
                    break
        f.write("#define ADC_KEY_1_L7_FLAG IRKEY_DUMY"+"\n")
    f.write("#endif"+"\n")