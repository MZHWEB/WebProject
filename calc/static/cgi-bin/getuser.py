#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import cgi,cgitb
import urllib2
form = cgi.FieldStorage()
if form.has_key('name'):
    code = form['name'].value
    print code