"""zqxt_views URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin
from calc import views as calc_views
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    url(r'^$',calc_views.login),
    url(r'^login.html',calc_views.login),
    url(r'^index.html',calc_views.index),
    url(r'^mianze.html',calc_views.mianze),
    url(r'^admin/', admin.site.urls),
    url(r'^login/$',calc_views.login_check,name='login_check'),
    url(r'^pages/$',calc_views.pages,name='pages'),
    url(r'^projectList/$',calc_views.projectList,name='projectList'),
    url(r'^newProject/$',calc_views.newProject,name='newProject'),
    url(r'^addCloud/$',calc_views.addCloud,name='addCloud'),
    url(r'^editPei/$',calc_views.editPei,name='editPei'),
    url(r'^custom/$',calc_views.custom,name='custom'),
    url(r'^add_pro/$',calc_views.addPro,name='addPro'),
    url(r'^delet/$',calc_views.delet,name='delet'),
    url(r'^addcol/$',calc_views.addcol,name='addcol'),
    url(r'^RuPwd/$',calc_views.RuPwd,name='RuPwd'),
    url(r'^RIcon/$',calc_views.RIcon,name='RIcon'),
    url(r'^getUser/$',calc_views.getUser,name='getUser'),
    url(r'^upLogo/$',calc_views.upLogo,name='upLogo'),
    url(r'^testName/$',calc_views.testName,name='testName'),
    url(r'^lookPro/$',calc_views.lookPro,name='lookPro'),
    url(r'^GetProkeypad/$',calc_views.GetProkeypad,name='GetProkeypad'),
    url(r'^savelist/$',calc_views.savelist,name='savelist'),
    url(r'^removeList/$',calc_views.removeList,name='removeList'),
    url(r'^colList/$',calc_views.colList,name='colList'),
    url(r'^getProSys/$',calc_views.getProSys,name='getProSys'),
    url(r'^config/$',calc_views.config,name='config'),
    url(r'^Download/$',calc_views.Download,name='Download'),
    url(r'^getHtml/$',calc_views.getHtml,name='getHtml'),
    url(r'^selectLg/$',calc_views.selectLg,name='selectLg'),
    url(r'^colAll/$',calc_views.colAll,name='colAll'),
]