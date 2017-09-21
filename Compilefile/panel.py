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

def WritePanelConfig(CloudProject,f):
    f.write("/* 屏参  */"+'\n')
    f.write("#define PANEL_DEFAULT_TYPE_SEL PNL_AOTO"+'\n')
    f.write("#if PANEL_DEFAULT_TYPE_SEL == PNL_AOTO"+'\n')
    panel = dd(CloudProject.panel_name)
    map = {
        '0':{'lvds_ti_mode':0,'ti_mode':0,'output_bitmode':0},
        '1':{'lvds_ti_mode':0,'ti_mode':0,'output_bitmode':1},
        '2':{'lvds_ti_mode':0,'ti_mode':0,'output_bitmode':2},
        '3':{'lvds_ti_mode':0,'ti_mode':2,'output_bitmode':0},
        '4':{'lvds_ti_mode':0,'ti_mode':2,'output_bitmode':1},
        '5':{'lvds_ti_mode':0,'ti_mode':2,'output_bitmode':2},
        '6':{'lvds_ti_mode':0,'ti_mode':3,'output_bitmode':0},
        '7':{'lvds_ti_mode':0,'ti_mode':3,'output_bitmode':1},
        '8':{'lvds_ti_mode':0,'ti_mode':3,'output_bitmode':2},
        '9':{'lvds_ti_mode':1,'ti_mode':0,'output_bitmode':0},
        '10':{'lvds_ti_mode':1,'ti_mode':0,'output_bitmode':1},
        '11':{'lvds_ti_mode':1,'ti_mode':0,'output_bitmode':2},
        '12':{'lvds_ti_mode':1,'ti_mode':2,'output_bitmode':0},
        '13':{'lvds_ti_mode':1,'ti_mode':2,'output_bitmode':1},
        '14':{'lvds_ti_mode':1,'ti_mode':2,'output_bitmode':2},
        '15':{'lvds_ti_mode':1,'ti_mode':3,'output_bitmode':0},
        '16':{'lvds_ti_mode':1,'ti_mode':3,'output_bitmode':1},
        '17':{'lvds_ti_mode':1,'ti_mode':3,'output_bitmode':2}
    }
    for key in panel_on_list :
        r = panel[key.lower()]
        if r == '1':
            str = "#define "+key+" ENABLE"
        else:
            str = "#define "+key+" DISABLE"
        del panel[key.lower()]
        f.write(str+"\n")
    for key in panel :
        if key == 'panel_enable_60hz':
            if panel[key] == '1':
                f.write("#define ENABLE_60HZ ENABLE"+"\n")
            else :
                f.write("#define ENABLE_60HZ DISABLE"+"\n")
        elif key == 'panel_map':
            n = panel[key]
            f.write("#define PANEL_LVDS_TI_MODE %s"%(map[n]['lvds_ti_mode'])+"\n")
            f.write("#define PNL_TI_MODE %s"%(map[n]['ti_mode'])+"\n")
            f.write("#define OUTPUT_BITMODE %s"%(map[n]['output_bitmode'])+"\n")
        elif key != 'id' and key != 'panel_name':
            r = key.upper()
            str = "#define %s %s"%(r,panel[key])
            f.write(str+"\n")
    f.write("#endif"+"\n")