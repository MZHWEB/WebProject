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

def dd(list):
    list = list.__dict__
    l = {}
    for key in list:
        if key != '_state':
            l[key] = list[key]
    return l