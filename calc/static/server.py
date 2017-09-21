#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from http.server import HTTPServer, CGIHTTPRequestHandler 

port=3000
 
httpd=HTTPServer(('',port),CGIHTTPRequestHandler)
print("Starting simple_http on port:"+str(httpd.server_port))
httpd.serve_forever()