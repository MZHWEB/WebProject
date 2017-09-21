# -*- coding: utf-8 -*-
import os
import shutil
import threading
import json
import random
import Queue
import traceback

def dd(list):
    list = list.__dict__
    l = {}
    for key in list:
        if key != '_state':
            l[key] = list[key]
    return l

# 遥控
def IRlist():
    i = 0
    temp_keylist = []
    while i < 255:
        temp_key = str(hex(i))
        if i < 16:
            temp_key = temp_key.replace('0x','0x0')
        temp_keylist.append(temp_key)
        i = i+1;
        pass
    return temp_keylist

#按键
keypad = {
    'CH+':'UP',
    'CH-':'DOWN',
    'VOL+':'RIGHT',
    'VOL-':'LEFT',
    'POWER':'POWER',
    'SOURCE':'INPUT_SOURCE',
    'MENU':'MENU',
}

#屏参
panel_on_list = [
    'PANEL_DUAL_PORT',
    'PANEL_DOUBLE_CLOCK',
    'PANEL_SWAP_PORT',
    'PANEL_SWAP_ODD_ML',
    'PANEL_SWAP_EVEN_ML',
    'PANEL_SWAP_ODD_RB',
    'PANEL_SWAP_EVEN_RB',
    'PANEL_SWAP_ODD_RG',
    'PANEL_SWAP_EVEN_RG',
    'PANEL_SWAP_ODD_GB',
    'PANEL_SWAP_EVEN_GB',
    'ENABLE_BLACK_WHITE_CHANGE'
]

#PQ
C_PQ = {
    'ihc_r':'BK1C_4B',
    'ihc_g':'BK1C_4C',
    'ihc_b':'BK1C_4D',
    'ihc_c':'BK1C_4E',
    'ihc_m':'BK1C_4F',
    'ihc_y':'BK1C_50',
    'ihc_f':'BK1C_51',

    'ibc_r':'BK1C_23',
    'ibc_g':'BK1C_24',
    'ibc_b':'BK1C_25',
    'ibc_c':'BK1C_26',
    'ibc_m':'BK1C_27',
    'ibc_y':'BK1C_28',
    'ibc_f':'BK1C_29',

    'icc_r':'BK2B_C3',
    'icc_g':'BK2B_C4',
    'icc_b':'BK2B_C5',
    'icc_c':'BK2B_C6',
    'icc_m':'BK2B_C7',
    'icc_y':'BK2B_C8',
    'icc_f':'BK2B_C9',
}

def WriteIRConfig(distlist):
    f = ''
    f += "/* 遥控  */"+'\n'
    f += "#define FACTORY_IR_TYPE_SEL FACTORY_IR_TYPE_NULL"+"\n"
    f += "#define IR_TYPE_SEL IR_AOTO"+"\n"
    f += "/* 主遥控  */"+'\n'
    f += "#if IR_TYPE_SEL == IR_AOTO"+"\n"
    IR = distlist
    f += "#define IR_SYSTEMCODE 0x%s"%(IR['remote_head_code'])+"\n"
    f += "#define IR_HEADER_CODE0 (IR_SYSTEMCODE>>8)"+"\n"
    f += "#define IR_HEADER_CODE1 (IR_SYSTEMCODE&0xFF)"+"\n"
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
                f += r+"\n"
            elif key == 'remote_header_code_time':
                r = r.replace("IRKEY","IR")
                r = "#define %s %s"%(r,IR[key])
                f += r+"\n"
            elif IR[key] != '':
                temp = "0x"+IR[key].lower()
                r = "#define "+r+" %s"%temp
                temp_keylist.remove(temp)
                f += r+'\n'
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
                f += r+'\n'

    f += "/* 副遥控  */"+'\n'
    f += "#endif"+"\n"
    return f

def WriteKeyPadConfig(distlist):
    f = ''
    f += "/* 按键  */"+'\n'
    f += "#define KEYPAD_TYPE_SEL KEYPAD_TYPE_AOTO"+"\n"
    KP = distlist
    flag  = False
    boardList = ['BD_ZVT_MV56RUU_G','BD_ZVT_MV56RUU_H','BD_ZVT_MV56RUU_J','BD_ZVT_MV56RJU_F','BD_ZVT_MV56RJU_G','BD_ZVT_MV56RJU_H']
    str = "#if KEYPAD_TYPE_SEL == KEYPAD_TYPE_AOTO"
    f += str+"\n"
    # r = distlist.board_type
    # for board in boardList:
    #     if r == board:
    #         f += "#define ENABLE_5KEY_FUNCTION ENABLE"+"\n"
    #         f += "#define KEYPAD_G 1"+"\n"
    #         f += "#define ADC_KEY_1_L0_FLAG IRKEY_INPUT_SOURCE"+"\n"
    #         f += "#define ADC_KEY_1_L1_FLAG IRKEY_LEFT"+"\n"
    #         f += "#define ADC_KEY_1_L2_FLAG IRKEY_MENU"+"\n"
    #         f += "#define ADC_KEY_1_L3_FLAG IRKEY_RIGHT"+"\n"
    #         f += "#define ADC_KEY_1_L4_FLAG IRKEY_POWER"+"\n"
    #         f += "#define ADC_KEY_1_L5_FLAG IRKEY_DUMY"+"\n"
    #         f += "#define ADC_KEY_1_L6_FLAG IRKEY_DUMY"+"\n"
    #         f += "#define ADC_KEY_1_L7_FLAG IRKEY_DUMY"+"\n"
    #         flag = True
    #         break
    if flag != True:
        if 'keypad_is_5key_mode' in KP:
            f += "#define ENABLE_5KEY_FUNCTION ENABLE"+"\n"
        else :
            f += "#define ENABLE_5KEY_FUNCTION DISABLE"+"\n"
        f += "#define KEYPAD_G 0"+"\n"
        i = 0
        for key in KP :
            if (key != 'keypad_is_5key_mode') or (key != 'keypad_name'):
                str = "#define ADC_KEY_1_L%s_FLAG IRKEY_"%i+keypad[KP['keypad_k%s'%i]]
                f += str+"\n"
                if i < 6:
                    i = i + 1
                else :
                    break
        f += "#define ADC_KEY_1_L7_FLAG IRKEY_DUMY"+"\n"
    f += "#endif"+"\n"
    return f

def WritePanelConfig(distlist):
    f = ''
    f += "/* 屏参  */"+'\n'
    f += "#define PANEL_DEFAULT_TYPE_SEL PNL_AOTO"+'\n'
    f += "#if PANEL_DEFAULT_TYPE_SEL == PNL_AOTO"+'\n'
    panel = distlist
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
        f += str+"\n"
    for key in panel :
        if key == 'panel_enable_60hz':
            if panel[key] == '1':
                f += "#define ENABLE_60HZ ENABLE"+"\n"
            else :
                f += "#define ENABLE_60HZ DISABLE"+"\n"
        elif key == 'panel_map':
            n = panel[key]
            f += "#define PANEL_LVDS_TI_MODE %s"%(map[n]['lvds_ti_mode'])+"\n"
            f += "#define PNL_TI_MODE %s"%(map[n]['ti_mode'])+"\n"
            f += "#define OUTPUT_BITMODE %s"%(map[n]['output_bitmode'])+"\n"
        elif key != 'id' and key != 'panel_name':
            r = key.upper()
            str = "#define %s %s"%(r,panel[key])
            f += str+"\n"
    f += "#endif"+"\n"
    return f

def WritePQConfig(distlist):
    f = ''
    f += "/* PQ通道  */"+'\n'
    PQ = distlist
    if 'pq_name' in PQ:
        del PQ['pq_name']
    if 'PQTime' in PQ:
        del PQ['PQTime']
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
                f += str+'\n'
        else :
            str = "#define %s 0x%s"%(C_PQ[key],PQ[key])
            f += str+'\n'
    f += "#define ENABLE_SWITCH_SOURCE_BLUESCREEN ENABLE"+"\n"
    return f