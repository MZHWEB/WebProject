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

def WritePQConfig(CloudProject,f):
    f.write("/* PQ通道  */"+'\n')
    PQ = dd(CloudProject.pq_name)
    del PQ['pq_name']
    del PQ['PQTime']
    del PQ['id']
    for key in PQ :
        keylist = key.split('_')
        if len(keylist) >= 3:
            ph = ''
            str = ''
            if keylist[2] == 'SVIDEO':
                ph = 'S_VIDEO'
            else :
                ph = keylist[2]
            if ('gain' in keylist[1]):
                if 'normal' in keylist[0]:
                    if keylist[1] == 'gainr':
                        norc = 'RED'
                    elif keylist[1] == 'gaing':
                        norc = 'GREEN'
                    elif keylist[1] == 'gainb':
                        norc = 'BLUE'
                    str = '#define %s_DEFAULT_COLOR_TEMP_%s %s'%(ph,norc,PQ[key])
                else :
                    str = '#define %s_INIT_VIDEO_COLOR_TEMP_%s %s'%(ph,
                        (keylist[0]+keylist[1].replace('gain','_')).upper(),PQ[key])
            elif('offset' in keylist[1]):
                str = '#define %s_INIT_VIDEO_COLOR_BRIGHTNESS_%s %s'%(ph,
                        (keylist[0]+keylist[1].replace('offset','_')).upper(),PQ[key])
            else:
                str = '#define %s_DEFAULT_NONLINEAR_CURVE_%s %s'%(ph,
                        (keylist[0]+keylist[1].replace('osd','_')).upper(),PQ[key])
            if str != '':
                f.write(str+'\n')
        else :
            str = "#define %s 0x%s"%(C_PQ[key],PQ[key])
            f.write(str+'\n')
    f.write("#define ENABLE_SWITCH_SOURCE_BLUESCREEN ENABLE"+"\n")