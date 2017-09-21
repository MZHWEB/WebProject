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
from normaldict import*

class updata:
	upfile_path = ''
	fname = ''
	def __init__(self,upfile,BASE_DIR,CloudProject):
		self.upfile = upfile
		self.BASE_DIR = BASE_DIR
		self.CloudProject = CloudProject
		updata.openTxt(self)
		updata.filename(self)
		updata.updataIN(self)
	
	def  openTxt(self):
		f = open(self.upfile,"r")  
		lines = f.readlines()#读取全部内容  
		for line in lines :
			if line != '':
				updata.upfile_path = line
		f.close()

	def filename(self):
		pro = self.CloudProject
		if pro.tv_system == 'NTSC':
			tv_sys = 'P_OFF'
		else :
			tv_sys = 'P_ON'
		lang = language[pro.default_language]
		if pro.keypad_name.keypad_is_5key_mode != '1':
			key_sys = '7KEY'
		else :
			key_sys = '5KEY'
		makelist = updata.upfile_path.split('_')
		maketime = "%s_%s_%s"%(makelist[-4],makelist[-2],makelist[-1].split('/')[0]) 
		updata.fname = 'ZVT_%s_%s_%s_%s_MAP%s_%s_IR_%s_%s_%s_%s.zip'%(pro.id,pro.board_type,tv_sys,
												pro.panel_name.panel_name,pro.panel_name.panel_map,
												lang,pro.frist_remote.remote_name,key_sys,
												pro.keypad_name.keypad_name,maketime)

	def updataIN(self):
		upto_path = "%s/media/configzip/"%(self.BASE_DIR)
		cmd = 'zip -jr %s %s'%(updata.fname,updata.upfile_path)
		os.system(cmd);
		shutil.move("%s/Compilefile/%s"%(self.BASE_DIR,updata.fname),upto_path)
		print cmd
		
		os.system('rm %s'%updata.upfile_path)
		updata.fname = "media/configzip/%s"%(updata.fname)
		# cmd = "mv %s %s"%()
	