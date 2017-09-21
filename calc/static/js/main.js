/**
 * Created by Administrator on 2017/4/12.
 */
$(document).ready(function () {
    //获取登陆的状态等等
    var login={
        'uName':'',//初始化用户名
        'uPwd':''//初始化密码
    };
    login.uName = sessionStorage.getItem('DX-uName');//获取session保存的用户名
    login.uPwd = sessionStorage.getItem('DX-uPwd');//获取session保存的密码
    var uid = null,uicon = null,user_author=null;//初始化用户IDuid、用户头像uicon、用户备用名user_author
    $.ajax({//验证是否已登录
            type:'GET',
            url:'/login/',
            data: login,
            dataType:'json',
            success: function(txt) {
                if (txt == 'err'){//如果没有登陆，则跳转到登陆页面
                    alertMsg({msg:'请先登陆后再访问该页面!!!',mEn:'Please login first and then visit the page!!'});
                    window.open('login.html','_self');
                }else{//如果登陆则保存用户信息
                    uid = txt['0']['id'];
                    uicon = txt['0']['user_icon'];
                    user_author = txt['0']['user_author'];
                    if(uicon.indexOf('static')<0){
                        uicon = 'media/'+uicon;
                    }
                    $('#userD .user-img img').attr('src',uicon);//把用户头像替换到页面
                    $('#userD span:nth-child(2) pre.Chinese').html('你好，'+txt['0']['comment']);//中文的用户名添加到页面
                    $('#userD span:nth-child(2) pre.English').html('Hello，'+txt['0']['comment']);//英文版的用户名添加到页面
                    if(txt['0']['user_language']=='中文简体'){//如果语言等于‘中文简体’，则修改body的class，显示中文版
                        $('body').attr('class','CH');
                        $('#select-language').text('切换到英文')
                    }else if(txt['0']['user_language']=='English'){//如果语言等于‘English’，则修改body的class，显示英文版
                        $('body').attr('class','En');
                        $('#select-language').text('Switch to Chinese')
                    }else{//否则默认显示英文版
                        $('body').attr('class','CH');
                        $('#select-language').text('切换到英文')
                    }
                    project('static/data/data/index.html');//显示主页
                }
            },
            error:function(){
                alertMsg({msg:'获取数据失败！！！',mEn:'Failed to obtain data!!!'});//如果没有得到数据则弹出一个错误信息
            }
    });
    
    var sess = ['CloudIR','fu-remote','CloudKeypad','CloudPanel','CloudPQ'];
    for(var i=0;i<sess.length;i++){//清楚缓存的配置信息
        sessionStorage.removeItem(sess[i]);
    }
    //拖拽入
    function ddown(el, sclone, ele) {
        if (ele.html() != '') {//如果该元素的内容不为空，则删除id为keydown的中的包含该元素子元素span内容的span元素的样式
            $("#keydown .btn-xs:contains('" + ele.children('span').html() + "')")
                .removeAttr('style');
        }
        ele.html(sclone);//把克隆的元素放入该元素
        ele.next('input').val(el.html());//把el元素的内容放入ele的下一个input输入框当做值
        el.removeAttr('style').hide();//隐藏el元素
        ele.children().tinyDraggable({handle: 0, exclude: 0}, repla);//再次调用拖拽函数
    }

    //拖拽替换
    function repla(el, sclone, ele) {
        if (ele.html() != '') {//如果该元素的内容不为空，则互换他们的值
            var tclone = ele.children('span').clone();
            el.parent().html(tclone).next('input').val(tclone.text());
            tclone.tinyDraggable({handle: 0, exclude: 0}, repla);
        } else {//否则删除当前元素
            el.remove();
        }
        ele.html('<span class="btn btn-default btn-xs">' + sclone.text() + '</span>');//把克隆的元素放入该元素
        ele.next('input').val(sclone.html());//把克隆的内容放入ele的下一个input输入框当做值
        ele.children().tinyDraggable({handle: 0, exclude: 0}, repla);//再次调用拖拽函数
    }

    //拓展jQuery
    //拖拽
    (function ($) {
        $.fn.tinyDraggable = function (options, fn) {
            var settings = $.extend({handle: 0, exclude: 0}, options);
            return this.each(function () {
                var dx, dy, el = $(this), handle = settings.handle ? $(settings.handle, el) : el;
                handle.on({
                    mousedown: function (e) {
                        el.css('position', 'absoluter');
                        if (settings.exclude && ~$.inArray(e.target, $(settings.exclude, el))) return;
                        e.preventDefault();
                        var os = el.offset();
                        dx = e.pageX - os.left, dy = e.pageY - os.top;
                        $(document).on('mousemove.drag', function (e) {
                                el.offset({top: e.pageY - dy, left: e.pageX - dx});
                                var y = el.offset().top - $("#CloudKeypad div label.my-sm-1 div").offset().top;
                                if (y > -20 && y < 20) {
                                    for (var i = 0; i < $("#CloudKeypad div label.my-sm-1 div").length; i++) {
                                        var ele = $("#CloudKeypad div label.my-sm-1:nth-child(" + (i + 1) + ") div");
                                        var x = el.offset().left - ele.offset().left;
                                        if (x > -30 && x < 60) {
                                            ele.css('border-color','red');
                                            ele.parent().siblings('label').children('div').removeAttr('style');
                                        }
                                    }
                                }
                            }
                        );
                    },
                    mouseup: function (e) {
                        $("#CloudKeypad div label.my-sm-1 div").removeAttr('style');
                        var y = el.offset().top - $("#CloudKeypad div label.my-sm-1 div").offset().top;
                        if (y > -20 && y < 20) {
                            var sclone = el.clone();
                            sclone.removeAttr('style');
                            for (var i = 0; i < $("#CloudKeypad div label.my-sm-1 div").length; i++) {
                                var ele = $("#CloudKeypad div label.my-sm-1:nth-child(" + (i + 1) + ") div");
                                var x = el.offset().left - ele.offset().left;
                                if (x > -30 && x < 60) {
                                    fn(el, sclone, ele);
                                    return false;
                                }
                            }
                        } else {
                            $(this).removeAttr('style');
                            $("#CloudKeypad .custom-content>div>.btn-xs:contains('" + el.html() + "')")
                                .removeAttr('style').show();
                            $("#CloudKeypad div.in>.btn-xs:contains('" + el.html() + "')")
                                .remove();
                        }
                        $(document).off('mousemove.drag');
                    }
                });
            });
        }
    })(jQuery);
    //表单序列化
    (function($){ 
        $.fn.serializeJson=function(){ 
              var serializeObj={};
              var id = this.attr('id');
              $('input[form='+id+']').each(function(){
                  if($(this).attr('type')=='checkbox'||$(this).attr('type')=='radio'){
                      if($(this).prop('checked')==true){
                          serializeObj[$(this).attr('name')]=$(this).val();
                      }
                  }else{
                      serializeObj[$(this).attr('name')]=$(this).val();
                  }
              });
              return serializeObj;
        }; 
      })(jQuery);
    //图片上传
    jQuery.fn.extend({
        uploadPreview: function (opts) {
            var _self = this,
                _this = $(this);
            opts = jQuery.extend({
                Msg: 'usepMsg',
                Img: "ImgPr",
                Width: null,
                Height: null,
                imgSize:null,
                display:true,
                ImgType: ["gif", "jpeg", "jpg", "bmp", "png"],
                Callback: function (url) {
                }
            }, opts || {});
            _self.getObjectURL = function (file) {
                var url = null;
                if (window.createObjectURL != undefined) {
                    url = window.createObjectURL(file)
                } else if (window.URL != undefined) {
                    url = window.URL.createObjectURL(file)
                } else if (window.webkitURL != undefined) {
                    url = window.webkitURL.createObjectURL(file)
                }
                return url
            };
            _this.change(function () {
                if (this.value) {
                    if (!RegExp("\.(" + opts.ImgType.join("|") + ")$", "i").test(this.value.toLowerCase())) {
                        alertMsg({title:'错误',tEn:'Error',msg:"选择文件错误,图片类型必须是" + opts.ImgType.join(",") + "的其中一种!!",mEn:'Select file error. The picture type must be one of '+opts.ImgType.join(",")+'!!'});
                        this.value = "";
                        return false
                    }
                    var img = $('<img/>');
                    img.dynsrc = this.value;
                    var size = null,url=null;
                    if(img.fileSize){
                        url = img.fileSize;
                        size = img.fileSize;
                    }else if(this.files){
                        url = this.files[0];
                        size = this.files[0].size;
                    }
                    if(size>opts.imgSize*1024){
                        alertMsg({title:'错误',tEn:'Error',msg:"图片大小不能超过"+opts.imgSize+"K!!",mEn:'Picture size must not exceed'+opts.imgSize+"K!!"});
                        this.value = "";
                        return false
                    }
                    var sh='',h='',w='';
                    if (opts.display==false){
                        sh='class="hidden"';
                    }
                    if (opts.Height!=null){
                        h='height: '+opts.Height+'px;';
                    }
                    if (opts.Width!=null){
                        w='width: '+opts.Width+'px;';
                    }
                    $('#' + opts.Msg).html("<img id='" + opts.Img + "' style='"+(w+h)+"'"+sh+"/>");
                    if ($.support) {
                        try {
                            $("#" + opts.Img).attr('src', _self.getObjectURL(this.files[0]))
                        } catch (e) {
                            var src = "";
                            var obj = $("#" + opts.Img);
                            var div = obj.parent("div")[0];
                            _self.select();
                            if (top != self) {
                                window.parent.document.body.focus()
                            } else {
                                _self.blur()
                            }
                            src = document.selection.createRange().text;
                            document.selection.empty();
                            obj.attr('src',src);
                            obj.hide();
                            obj.parent("div").css({
                                'filter': "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)",
                                'width': opts.Width + 'px',
                                'height': opts.Width*0.75 + 'px'
                            });
                            div.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = src;
                        }
                    } else {
                        $("#" + opts.Img).attr('src', _self.getObjectURL(this.files[0]))
                    }
                    opts.Callback(_self.getObjectURL(url))
                }
            })
        }
    });
    //时间格式
    function nowtime(){//将当前时间转换成yyyymmdd格式
        var mydate = new Date();
        var str = "" + mydate.getFullYear();
        var mm = mydate.getMonth()+1
        if(mydate.getMonth()>9){
         str += "-"+mm;
        }
        else{
         str += "-0" + mm;
        }
        if(mydate.getDate()>9){
         str += "-"+mydate.getDate();
        }
        else{
         str += "-0" + mydate.getDate();
        }
        if(mydate.getHours()>9){
            str += " "+mydate.getHours();
        }else{
            str += " 0"+mydate.getHours();
        }
        if(mydate.getMinutes()>9){
            str += ":"+mydate.getMinutes();
        }else{
            str += ":0"+mydate.getMinutes();
        }
        if(mydate.getSeconds()>9){
            str += ":"+mydate.getSeconds();
        }else{
            str += ":0"+mydate.getSeconds();
        }
        return str;
      }
    timer = null;
    //项目页
    function project(url, id) {
        $(".content").addClass('active');
        id = (id==null)?'#index':id;
        var fn=null;
        var table = '';
        switch (id) {//根据传入的id来修改表的内容
            case '#index':
                fn=pro;
                table = 'pro';
                break;
            case '#PC':
                fn=pc;
                table = 'pc';
                break;
            case '#button':
                fn=btn;
                table = 'btn';
                break;
            case '#remoto':
                fn=rmt;
                table = 'rmt';
                break;
            case '#PQ':
                fn=pq;
                table = 'pq';
                break;
            case '#LOGO':
                fn=lg;
                table = 'logo';
                break;
        }
        $(".content").load(url, function () {//载入对应的页面
            fn();//调用函数
            getList({id:table});//获取初始页的表
            reinto.init();//调用刷新页面的定时器
            pages({table:table});//获取对应表的页码
            $(".dropmenu").click(function () {//点击class包含‘dropmenu’的元素，弹出菜单
                dropleft(0);
            });
            //????目?斜??
            $(".nav-box li").click(function () {
                $(this).addClass("focus").siblings().removeClass("focus");//当前元素添加‘focus’类名，其他元素清楚‘focus’类名
                var sel = uid;
                var col = '',sort='-id';
                $('#author').addClass('hide');//先隐藏作者的那一列
                if($(this).text().indexOf('云端')==0){//如果当前的文本内容包含'云端'，则sel==‘all’，显示作者那一列
                    sel = 'all';
                    $('#author').removeClass('hide');
                }else if($(this).text().indexOf('星标')==0||$(this).text().indexOf('常用')==0){//如果当前的文本内容包含'星标'或者‘常用’，则col==‘1’，显示作者那一列
                    $('#author').removeClass('hide');
                    col = '1';
                    sort = '-'+SQL[table].replace('Cloud','').toLowerCase()+'_id';//按照id排列
                    if (table=='pro'){//如果table等于‘pro’，则按照项目id排序
                        sort = '-pro_id';
                    }else if(table=='logo'){//如果table等于‘logo’，则按照LOGOid排序
                        sort = '-logo_id';
                    }
                }
                getList({id:table,uid:sel,col:col,sort:sort});//获取内容列表
                pages({table:table,uid:sel,col:col});//获取页面页码
                search.gettitle();//调用搜索的函数
            });
            if (id!="#index"){//如果id不等于‘index’
                //新增配置
                $(".content-body .content-nav .pull-right button.btn-success").click(function(){//弹出配置页
                    var ur=$(this).attr('alrt');
                    alertPei(ur);
                });
            }
            $("#sort li").click(function () {//排序
                var val = $(this).children('a').html();
                $(this).children('a').html($("#sortMsg").html());
                $("#sortMsg").html(val);
                val = $(this).children('a').children('pre.Chinese').text();
                Sort(val);
            });
            search.init();//初始化搜索
        });
        //弹出配置页
        function alertPei(ur,tid,fn){
                $(".zhezhao").show();//显示遮罩层
                if(ur=='userMode'){
                    $("#list").load("static/data/update/"+ur+".html",function(){
                        //**//
                    }).show().css('opacity','1');
                }
                $("#list").load("static/data/update/"+ur+".html",function(){//加载配置页
                    if(user_author!='3'){//如果用户权限不等于3，则显示弹出‘生成代码’的按钮
                        $('.custom-btn').append('<button class="btn btn-default"><pre class="Chinese">生成代码</pre><pre class="English">Generating code</pre></button>')
                    }
                    $("#CloudKeypad div .btn-xs").tinyDraggable({handle: 0, exclude: 0}, ddown);//按键配置页，调用拖拽插件
                        //遥?兀????遥??
                    $("#CloudIR .IRshow button").click(function(){//遥控配置页面的不常用和复用的隐藏和显示
                        if($(this).attr('shows')=='1'){
                            $(this).parent().next().slideUp();
                            $(this).attr('shows','0').children('span').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
                        }else{
                            $(this).parent().next().slideDown();
                            $(this).attr('shows','1').children('span').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
                        }
                    });
                    $("#up_logo_btn").uploadPreview({//LOGO上传的预览和判断
                        Msg: 'logo-msg',
                        Img: "logoMsg",
                        Width: 609,
                        imgSize:150,
                        ImgType: ["gif", "jpeg", "jpg", "bmp", "png"],
                        Callback: function (url) {
                            var imger = $('<img/>');
                            imger.attr('src',url).load(function(){
                                var w,h;
                                w = this.width;
                                h = this.height;
                                $('#logo-px').text(w+'X'+h);
                            });
                        }
                    });
                    $("#up_logo_btn").change(function(){//把LOGO的文件名显示到LOGO名输入框
                        $(this).parents(".uploader").find(".filename").val($(this).val());
                        var name=$(this).val().split('\\');
                        name = name[name.length-1];
                        $('#logo_name').val(name);
                    });
                    $('#list .close').click(function(){//隐藏配置页面
                        $("#list").hide().html('');
                        $('#u-load').html('');
                        $("#user-modal").hide();
                        $('.zhezhao').hide();
                    });
                    var pq={};//声明一个数组
                    if(fn){//执行函数，把值赋给pq
                        pq=fn();
                    }
                    if ($(".custom-title h5").text().indexOf('当前')>=0){//如果配置页的标题包含‘当前’，则让配置页的输入框都禁止输入
                        $('#list input[type=text]').attr('readonly','readonly');
                        $('#list input[type=file]').attr('disabled','disabled');
                        $('#list input[type=checkbox]').attr('disabled','true');
                        return;
                    }
                    if ($(".custom-title h5").text().indexOf('编辑')<0){//如果配置页的标题包含‘编辑’，则执行以下操作
                        $('input[name=panel_out_timing_mode]').click(function(){//屏参配置中‘panel_out_timing_mode’输入框点击会弹出一个下拉框
                            //获取下拉框的值
                            var val = $(this).attr('val').split('|');
                            //生成一个新的html代码段
                            var html = '<ul class="selector" style="display: none;">';
                            $.each(val,function(p){
                                html+='<li>'+val[p]+'</li>'
                            });
                            html += '</ul>';
                            //清楚上一个下拉框
                            if ($(this).parent().siblings("ul").attr('class') == 'selector') {
                                $(this).parent().siblings(".selector").slideUp('fast', function () {
                                    $(this).remove();
                                });
                                return;
                            }
                            //添加到页面中
                            $(this).parent().parent().append(html);
                            //设置下拉框的位置和状态
                            $(".selector").attr('drop-on', '0');
                            $(".selector").css('bottom','100%');
                            $(".selector li").click(function(){//选择选项添加到输入框中，并删除下拉框
                                var val = $(this).text();
                                $('input[name=panel_out_timing_mode]').val(val);
                                $(this).parent().slideUp('fast', function () {
                                    $(this).remove();
                                });
                            });
                            $(this).parent().siblings(".selector").attr('drop-on', '1').slideDown('100');
                        });
                        //新增配置
                        dataUP(pq,'','addCloud/');
                    }else{//编辑配置
                        dataUP(pq,tid,'editPei/');
                    }
                }).show().css('opacity','1');
        }
        //pq
        function  pqlist(list){//pq配置的操作
            $('#copy-pq').click(function(){
                list=copyPQ(list);//复制pq
            });
            $("#CloudPQ input").keyup(function(){//键盘松开事件，把值保存到list
                list[$(this).attr('name')]=$(this).val();
            });
            $('#CloudPQ ul li').click(function(){//点击切换pq页面
                $(this).addClass('active').siblings().removeClass();
                var pqname=$(this).text();
                var r = /((?!.*_).+)/;
                $("#CloudPQ h5+div:not(div.QMAPREWRITE) input").each(function(){//循环遍历pq输入框，存入list
                    var p=$(this).attr('name').replace(r,pqname);
                    $(this).attr('name',p).val(list[p]);
                });
            });

            return list;
        }
        //pq的复制
        function  copyPQ(pq) {
            var r = /((?!.*_).+)/;
            $("#CloudPQ h5+div:not(div.QMAPREWRITE) input").each(function(){//把当前通道的pq值复制到所有通道
                var pin = $(this).attr('name');
                $('#CloudPQ ul li').each(function(){
                    var pqname = $(this).text();
                    var p=pin.replace(r,pqname);
                    pq[p]=pq[pin]
                });
            });
            return pq;
        }
        //提交配置信息
        function dataUP(addPQ,tid,url){
            if(table=='pq'){
                addPQ = pqlist(addPQ);//得到pq的参数配置
            }
            $('#copy-pq').click(function(){//点击复制，则跟新为新的pq配置
                addPQ=copyPQ(addPQ);
            });
            if(url=='editPei/'){//如果url等于‘editPei’，则获取当前的配置id
                var tname = tid;
            }
            //进行表单的格式化
            function formtable(tabl){
                var id = $("form").attr('id');
                var form=$("form").serializeJson();
                form['table']=tabl;
                form['Author_id']=uid;
                form[id+'Time']=nowtime();
                if(table=='pq'){
                    form = addPQ;
                    form['table']=tabl;
                    form['Author_id']=uid;
                    form[id+'Time']=nowtime();
                }else if(table=='pc'){
                    $("#CloudPanel input[type=checkbox]:not(:checked)").each(function(){
                        form[$(this).attr('name')]="0";
                    });
                }else if(table=='logo'){
                    form= {
                        'logo_name':$('#logo_name').val(),
                        'table':table,
                        'Author_id':uid,
                        'LOGOTime':nowtime()
                    };
                }
                if(url=='editPei/'){
                    form['tname']=tname;
                }
                return form;
            }
            //进行提交
            $("#list .custom-btn button.btn-success").click(function(){
                var tabl=$(this).parent().parent().attr('id');//得到修改的表的名称
                var form = formtable(tabl);//获得格式化数据
                var statu = true,Msg='',mEn='';//初始化信息格式状态，默认为真
                //得到配置的名称
                var name = $(".custom-content>div:first-child input");
                if(table=='logo'){
                    name = $(".custom-content>div input[name=logo_name]");
                }
                var name_val = name.val();
                //判断配置名是否为空
                if(name_val==''){
                    statu = false;
                    Msg = name.prev().find('pre.Chinese').text()+'不能为空！！';
                    mEn = name.prev().find('pre.English').text()+' can not be empty!!';
                };
                //判断配置名的格式是否正确
                if(statu==true){
                    if(testREX.name.test(name_val)){
                        statu = false;
                        Msg = name.prev().find('pre.Chinese').text()+'不能包含：\\ / : * \" ? < > |以及中文字符！！';
                        mEn = name.prev().find('pre.English').text()+' does not contain: \ \ \ "/: *? < > | and Chinese character!!';
                    }
                }
                //判断遥控配置的格式是否正确
                if(statu==true&&table=='rmt'){
                    var oneMsg=IRM($("#CloudIR input[type=text]"),'IR ');
                    statu = oneMsg.statu;
                    Msg = oneMsg.Msg;
                    mEn = oneMsg.mEn;
                }
                //判断LOGO的文件名格式是否正确
                if(statu==true&&table=='logo'){
                    if(testREX.name.test($("#logo_name").val())){
                        statu = false;
                        Msg = '上传的文件名不能包含：\\ / : * \" ? < > |以及中文字符！！';
                        mEn = 'The uploaded file name cannot contain: \ \ \ "/: *? < > | and Chinese character!!';
                    }
                }
                //如果错误，则弹出错误信息
                if(statu==false){
                    alertMsg({title:'错误',tEn:'Error',msg:Msg,mEn:mEn},function(){
                        return;
                    });
                    return;
                }
                //判断名称是否存在
                if(statu==true&&url!='editPei/'){
                    $.ajax({
                        type:'POST',
                        url:'testName/',
                        data:{SQL:tabl,name:name_val},
                        success:function(text){
                            if(text=='err'){
                                statu = false;
                                Msg = '该名称已经有人使用了，请跟换哟!';
                                mEn = 'The name is already in use. Please change it!';
                            }
                            peiAjax(statu,Msg);
                        }
                    });
                    return;
                }
                //提交配置信息
                peiAjax(statu,Msg);
                function peiAjax(statu,Msg,mEn){
                    if(statu==false){
                        alertMsg({title:'错误',tEn:'Error',msg:Msg,mEn:mEn},function(){
                        return;
                    });
                    return;
                }
                    //弹出正在提交的提示信息
                alertMsg({title:'提示',msg:'正在提交中......',mEn:'In submission......'},function(){

                });
                var file = null;
                if (table=='logo'){
                    file = $('#up_logo_btn');
                }
                formdata({
                    data: form,
                    file:file,
                    type:'POST',
                    url:url,
                    fn: function(){
                        //提交成功则弹出提交成功的提示框，并刷新当前页
                        alertMsg({title:'提示',msg:'提交成功!!!'},function(){

                        });
                        $("#list").hide().html('');
                        $('.zhezhao').hide();
                        $('.nav-box li:nth-child(1)').addClass('focus').siblings().removeClass('focus');
                        getList({id:table,uid:uid});
                        pages({table:table});
                    }
                });
                }
            });
            //管理员的查看编译代码的操作
            $("#list .custom-btn button.btn-default").click(function(){
                var tabl=$(this).parent().parent().attr('id');
                var form=$("form").serializeJson();
                form['table']=tabl;
                form["user_author"]=user_author;
                if(table=='pq'){
                    form = addPQ;
                    form['table']=tabl;
                }else if(table=='pc'){
                    $("#CloudPanel input[type=checkbox]:not(:checked)").each(function(){
                        form[$(this).attr('name')]=0;
                    });
                }
                var statu = true,Msg='',mEn='';
                if(statu==true&&table=='rmt'){
                    var oneMsg=IRM($("#CloudIR input[type=text]"),'遥控中的','IR ');
                    statu = oneMsg.statu;
                    Msg = oneMsg.Msg;
                    mEn = oneMsg.mEn;
                }
                if(statu==false){
                    alertMsg({title:'错误',msg:Msg,mEn:mEn},function(){
                        return;
                    });
                    return;
                }
                var ajx = {
                    type:"POST",
                    url:'config/',
                    data:form,
                    success:function(text){
                        $("#config").val(text);
                        $("#configtext").modal('show');
                    }
                };
                if(table=='logo'){
                    ajx.processData=false;
                    ajx.contentType=false;
                }
                $.ajax(ajx);
            });
        }
        //编辑配置
        function edd(){
            $("tbody tr").dblclick(function(){//双击表当前项的事件
                var th = $(this);
                var tid = th.children('td:first-child').text();
                var ur=$(".content-body .content-nav .pull-right button.btn-success").attr('alrt');
                if(table=='btn'&&$('ul.nav-box li.focus').text().indexOf('我的')<0){//如果表是按键页，并且不是‘我的’，则返回
                    return;
                }
                alertPei(ur,tid,function(){//调用配置弹出框
                    var tt=$(".custom-title h5").text();
                    if(table=='logo'){
                        tt = tt.replace('上传','新建');
                    }
                    if($('ul.nav-box li.focus').text().indexOf('我的')>=0){//如果是在自己的项目下，则可以进行编辑
                        $(".custom-title h5").text(tt.replace('新建','编辑'));
                    }else{//否则就执行查看操作
                        $(".custom-title h5").text(tt.replace('新建','当前'));
                    }
                    var rname = th.children('td:nth-child(2)').text();
                    var id = $("#list").children().attr('id');
                    if(id=='logo'){
                        rname = th.children('td:nth-child(3)').text();
                    }
                    var data = {'SQL':id,'Rname':rname};
                    return look(data,id);
                });
            });
        }
        //查看项目信息
        function lookProject(tid,statu){
            reinto.clear();//清楚定时器
            var cloudpq = {};//初始化pq参数
            $("#logo_name").hover(//LOGO图片的hover事件
                function(){
                    if($('#logo_name').val()!=''){
                        $('#LogoMsg').show();
                    }
                },
                function(){
                    $('#LogoMsg').hide();
                }
            );
            $("#board_type").hover(//板型的图片
                function(){
                    if($('#board_type').val()!=''&&$('#boardMsg').html()!=''){
                        $('#boardMsg').show();
                    }
                },
                function(){
                    $('#boardMsg').hide();
                }
            );
            $.ajax({//获取当前项目配置的参数
                type:'GET',
                url:'lookPro/',
                data:{pid:tid},
                success:function(data){
                    var reg = /__[^\r\n]+/;
                    if(data['board']['board_img1']!=''){//板型图片的加入
                        var html = '<img style="width: 350px" src="media/'+data['board']['board_img1']+'"/>\
                                    <img style="width: 350px" src="media/'+data['board']['board_img2']+'"/>';
                        $("#boardMsg").html(html);
                    }
                    $.each(data['pro'],function(i){//其它参数的填入输入框
                        var input = $("input[name="+i.replace(reg,'')+"]");
                        if (i=='logo'){
                            input = $("#logo");
                        }
                        into(input,data['pro'],i);
                        if(i=='logo'&&data['pro'][i]!=''){//如果i等于logo，并且data['pro'][i]不等于空,则LOGO预览的添加
                            $('#LogoMsg').html('<img src="media/'+data['pro'][i]+'" style="width: 300px;">');
                        }
                    });
                    $.each(data,function(p){//循环遍历data
                        var list = data[p];
                        if(p!='pro'){
                            $.each(list,function(i){//把普通的值循环填入输入框
                                var input = $("#"+p+" input[name="+i+"]");
                                into(input,list,i);
                                if(p=='CloudKeypad'){//如果p等于CloudKeypad(按键),则填入之后还要对其进行调用拖拽插件
                                    $("#CloudKeypad .custom-content > div>.btn-xs").hide();
                                    if(i!='keypad_name'&&input.attr('type')=='text'){//把输入框之前的元素加入一个按钮样式的span元素
                                        var btn = '<span class="btn btn-default btn-xs">'+list[i]+'</span>';
                                        input.prev().html(btn);
                                        if(statu){ //调用拖拽
                                            input.prev().children().tinyDraggable({handle: 0, exclude: 0}, repla);
                                        }
                                    }
                                }
                                if(p=='CloudPQ'){//如果p等于‘CloudPQ’
                                    if(i!='id'){//并且i不等于‘id’，把他赋给cloudpq
                                        cloudpq[i]=list[i];
                                    }
                                }
                            });
                        }
                    });
                    function into(input,data,i){
						if(input.attr('type')=='checkbox'&&data[i]=='1'){//如果这个输入是复选框，并且data[i]等于1，则选中，并加入样式‘active’
                            input.attr('checked','1').parent().addClass('active');
                        }else if(input.attr('type')!='checkbox'){//否则，直接填入值
                            input.val(data[i]);
                            input.attr('title',data[i])
                        }
                    }
                    pqlist(data['CloudPQ']);
                    //返回cloudpq
                    return cloudpq;
                }
            });
            return cloudpq;
        }

        function eddPro(){
            $("tbody tr").dblclick(function(){//双击项目列表页的列表
                //获得该列的编号
                var tid = $(this).children('td:first-child').text();
                //加载project.html页面
                $(".content-body").html('').load('static/data/data/project.html', function () {
                    //遥控和副遥控的复用遥控码值和不常用遥控码值的展开和收起
                    $("#CloudIR .IRshow button,#fu-remote .IRshow button").click(function(){
                        if($(this).attr('shows')=='1'){//如果这个的‘shows’属性等于1，则收起，并修改‘shows’的值为0
                            $(this).parent().next().slideUp();
                            $(this).attr('shows','0').children('span').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
                        }else{//否则展开，并修改‘show’的值为1
                            $(this).parent().next().slideDown();
                            $(this).attr('shows','1').children('span').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
                        }
                    });
                    $(".content").removeClass('active');
                    //把所有的输入参数的地方都禁止输入
                    adminHtml('project',$("div.adminNeed"),function(){
                        $(".content-body input[type=checkbox]:not(#showCheckbox)").attr('disabled','true');
                    });
                    $("#showCheck").click(function(){
                        if($(this).find('input[type=checkbox]').is(':checked')){
                            $(this).parents('.row').siblings('.row').show()
                        }else{
                            $(this).parents('.row').siblings('.row').hide()
                        }
                    });
                    $("#listEdit ul li").remove();
                    reinto.clear();
                    $(".content-body input[type=text]").attr('readonly','1');
                    $(".content-body input[type=checkbox]:not(#showCheckbox)").attr('disabled','true');
                    $(".content-body input[type=file]").attr('disabled','true');
                    //调用查看项目
                    var data = lookProject(tid,false);
                    //
                    $(".drop-alert").click(function () {//弹出右边的配置框
                        var id = $(this).attr('drop-alert');
                        $("#" + id).show().siblings('div').hide();
                        $(".custom-bg").show();
                        $(".custom").css('margin-right', '0px');
                    });
                    //
                    $(".custom-bg").click(function () {//点击背景，隐藏所有弹出
                        var val = $('.custom>div[style=""] div.custom-content>div:nth-child(1) input').val();
                        $(this).hide();
                        $(".custom").removeAttr('style');
                    });
                })
            });
        }
        //复制项目
        function copyPro(tid,val){//复制项目
            reinto.clear();//清楚定时器
            var groupList=null;
            if(val==''){//如果val等于空，则val等于'MV56_80PIN'
                val = 'MV56_80PIN';
            }
            goProject(val,groupList,function(){//进入项目页，并把原有配置填入页面
                var pq=lookProject(tid,true);
                return pq;
            });
        }
        //查看配置
        function look(dd,id){
            var cloudpq = {};
            $.ajax({
                 type:"GET",
                 url:"custom/",
                 data:dd,
                 dataType:'json',
                 success:function(data){
                     $.each(data,function(i){
                         var th=$("#"+id+" input[name="+i+"]");
                         if(i=='logo_src'){
                             th = $("#logo_url");
                             url = '../media/'+data[i];
                             $("#logo-msg img").attr('src',url);
                             var imger = $('<img/>');
                             imger.attr('src',url).load(function(){
                                 var w,h;
                                 w = this.width;
                                 h = this.height;
                                 $('#logo-px').text(w+'X'+h);
                             });
                         }
                         if(th.attr('type')=='checkbox'&&data[i]=='1'){
                             th.attr('checked','1').parent().addClass('active');
                         }else if(th.attr('type')!='checkbox'){
                             th.val(data[i]);
                         }
                         if(id=='CloudKeypad'){
                             $("#CloudKeypad .custom-content > div>.btn-xs").hide();
                             if(i!='keypad_name'&&th.attr('type')=='text'){
                                 var btn = '<span class="btn btn-default btn-xs">'+data[i]+'</span>';
                                 th.prev().html(btn);
                                 th.prev().children().tinyDraggable({handle: 0, exclude: 0}, repla);
                             }
                         }
                         if(id=='CloudPQ'){
                             if(i!='id'){
                                 cloudpq[i]=data[i];
                            }
                         }
                      });
                     return cloudpq;
                  }
            });
            return cloudpq;
        }
        //?目页
        function testPRO(data,p){//传入data对象，p关键字
            var a = null;
            $.each(data,function(i){//循环遍历data，如果i包含p，则把i赋值给a
                if(i.indexOf(p)>=0){
                    a = i;
                    return a;
                }
            });
            //返回a
            return a;
        }
        //获取列表
        function getList(obts){
            //获取当前的上面的分类
            var tt = $(".nav-box li.focus").text();
            //初始页面为1
            var page = '1';
            if($(".pagination").children('li').html()){
                //获取当前的页码
                page = $(".pagination li.active").text();
            }
            //如果obts不为空则替换set对象的键值
            var set=$.extend({id:table,page:page,sort:'-id',uid:uid,col:'',serch:''},obts||{});
            if($('.search-box input').val()!=''){
                //搜索的内容
                set.serch = $(".search-type").attr('serch')+':'+$('.search-box input').val();
            }
            if (tt.indexOf('星标')==0||tt.indexOf('常用')==0){//当
                set.col = 1;
            }else if(tt.indexOf('云端')==0){
                set.uid = 'all';
            }
            if (($("#sortMsg").text() == "按名字排序")&&(tt.indexOf('星标')<0||tt.indexOf('常用')<0)){
                set.sort = $("thead th:nth-child(2)").attr('serch');
            }
            $.ajax({
                type:"GET",
                url:"projectList/",
                data:set,
                dataType:"json",
                success:function(data){
                    var html='',collect='',htm='';
                    if(set.col==''){
                        collect = '<a href="" class="btn btn-xs btn-link"><span class="glyphicon glyphicon-star-empty"></span></a>';
                    }
                    $.each(data,function(i){
                        var uhtm = '';
                        if(set.uid != uid){
                            uhtm = '<td>'+data[i][testPRO(data[i],'comment')]+'</td>';
                        }
                        if(set.col==1){
                            uhtm = '<td>'+data[i][testPRO(data[i],'comment')]+'</td>';
                        }
                        if((set.col==1&&data[i]['colAll']=='1')){
                            htm = ''
                        }else if(set.uid=='all'&&uid == '3'){
                            htm = ''
                        }else{
                            htm='<a href="" class="btn btn-xs btn-default"><span class="glyphicon glyphicon-trash"></span></a>';
                        }
                        if(set.col==1&&data[i]['colAll']=='1'){
                            html += '<tr colAll="1">';
                        }else {
                            html += '<tr>'
                        }
                        switch (set.id) {
                            case 'pro'://项目页列表
                                var status = '';
                                switch (data[i][testPRO(data[i],'build_status')]){
                                    case '0':
                                        status = '<span class="label label-info"><pre class="Chinese">订单已受理</pre><pre class="English">The order has been accepted</pre></span>';
                                        break;
                                    case '1':
                                        status = '<span class="label label-primary"><pre class="Chinese">正在编译中...</pre><pre class="English">Compiling...</pre></span>';
                                        break;
                                    case '2':
                                        status = '<span class="label label-success"><pre class="Chinese">编译成功</pre><pre class="English">Success</pre></span>';
                                        break;
                                    case '3':
                                        status = '<span class="label label-default"><pre class="Chinese">编译失败</pre><pre class="English">Default</pre></span>';
                                        break;
                                }
                                html+='<td flag="'+data[i][testPRO(data[i],'project_flag')]+'">'+data[i].id+'</td>\
                                        <td>'+data[i][testPRO(data[i],'board_type')]+'</td>\
                                        <td title="'+data[i][testPRO(data[i],'panel_name')]+'">'+data[i][testPRO(data[i],'panel_name')]+'</td>\
                                        <td>'+data[i][testPRO(data[i],'default_language')]+'</td>\
                                        <td>'+data[i][testPRO(data[i],'remote_name')]+'</td>\
                                        <td class="kk">'+data[i][testPRO(data[i],'keypad_name')]+'</td>\
                                        <td>'+data[i][testPRO(data[i],'projectTime')]+'</td>\
                                        <td>'+status+'</td>\
                                        '+uhtm+'\
                                        <td>\
                                            <a href="" class="btn btn-xs btn-default" data-toggle="tooltip" data-placement="bottom"><span class="glyphicon glyphicon-plus"></span></a>\
                                            <a href="'+data[i][testPRO(data[i],'project_file')]+'" class="btn btn-xs btn-default"><span class="glyphicon glyphicon-save"></span></a>\
                                            '+htm+collect+'\
                                        </td>\
                                    </tr>';
                                break;
                            case 'pc'://屏参列表
                                html+='<td>'+data[i].id+'</td>\
                                        <td>'+data[i][testPRO(data[i],'panel_name')]+'</td>\
                                        <td>'+data[i][testPRO(data[i],'PanelTime')]+'</td>\
                                        '+uhtm+'\
                                        <td>\
                                            <a href="" class="btn btn-xs btn-default" data-toggle="tooltip" data-placement="bottom"><span class="glyphicon glyphicon-plus"></span></a>\
                                            '+htm+collect+'\
                                        </td>\
                                    </tr>';
                                break;
                            case 'btn'://按键列表
                                html+='<td>'+data[i].id+'</td>\
                                        <td>'+data[i][testPRO(data[i],'keypad_name')]+'</td>\
                                        <td>'+(data[i][testPRO(data[i],'keypad_is_5key_mode')]=='1'?'√':'×')+'</td>\
                                        <td>'+data[i][testPRO(data[i],'keypad_k0')]+'</td>\
                                        <td>'+data[i][testPRO(data[i],'keypad_k1')]+'</td>\
                                        <td>'+data[i][testPRO(data[i],'keypad_k2')]+'</td>\
                                        <td>'+data[i][testPRO(data[i],'keypad_k3')]+'</td>\
                                        <td>'+data[i][testPRO(data[i],'keypad_k4')]+'</td>\
                                        <td>'+data[i][testPRO(data[i],'keypad_k5')]+'</td>\
                                        <td>'+data[i][testPRO(data[i],'keypad_k6')]+'</td>\
                                        <td>'+data[i][testPRO(data[i],'KeypadTime')]+'</td>\
                                        '+uhtm+'\
                                        <td>\
                                            <a href="" class="btn btn-xs btn-default" data-toggle="tooltip" data-placement="bottom"><span class="glyphicon glyphicon-plus"></span></a>\
                                            '+htm+collect+'\
                                        </td>\
                                    </tr>';
                                break;
                            case 'rmt'://遥控列表
                                html+='<td>'+data[i].id+'</td>\
                                        <td>'+data[i][testPRO(data[i],'remote_name')]+'</td>\
                                        <td>'+data[i][testPRO(data[i],'remote_head_code')]+'</td>\
                                        <td>'+data[i][testPRO(data[i],'IRTime')]+'</td>\
                                        '+uhtm+'\
                                        <td>\
                                            <a href="" class="btn btn-xs btn-default" data-toggle="tooltip" data-placement="bottom"><span class="glyphicon glyphicon-plus"></span></a>\
                                            '+htm+collect+'\
                                        </td>\
                                    </tr>';
                                break;
                            case 'pq'://PQ列表
                                html+='<td>'+data[i].id+'</td>\
                                        <td>'+data[i][testPRO(data[i],'pq_name')]+'</td>\
                                        <td>'+data[i][testPRO(data[i],'PQTime')]+'</td>\
                                        '+uhtm+'\
                                        <td>\
                                            <a href="" class="btn btn-xs btn-default" data-toggle="tooltip" data-placement="bottom"><span class="glyphicon glyphicon-plus"></span></a>\
                                            '+htm+collect+'\
                                        </td>\
                                    </tr>';
                                break;
                            case 'logo'://LOGO列表
                                html+='<td>'+data[i].id+'</td>\
                                        <td> <img height="50px" src="media/'+data[i][testPRO(data[i],'logo_src')]+'"/></td>\
                                        <td>'+data[i][testPRO(data[i],'logo_name')]+'</td>\
                                        <td>'+data[i][testPRO(data[i],'LOGOTime')]+'</td>\
                                        '+uhtm+'\
                                        <td>\
                                            <a href="" class="btn btn-xs btn-default" data-toggle="tooltip" data-placement="bottom"><span class="glyphicon glyphicon-plus"></span></a>\
                                            <a download="media/'+data[i][testPRO(data[i],'logo_src')]+'" target="_blank" href="media/'+data[i][testPRO(data[i],'logo_src')]+'" class="btn btn-xs btn-default"><span class="glyphicon glyphicon-save"></span></a>\
                                            '+htm+collect+'\
                                        </td>\
                                    </tr>';
                        }
                    });
                    //
                    $("tbody").html(html);
                    edit();
                    editlist.init(table);
                    //ShowKey.init(set.id);
                    if(table=='pro'){
                        eddPro();
                        return;
                    }
                    edd();
                }
            });
        }
        //下载图片
        function DownLoadReportIMG(imgPathURL) {
            //如果隐藏IFRAME不存在，则添加
            if (!document.getElementById("IframeReportImg"))
            $('').appendTo('body');

            if (document.all.IframeReportImg.src != imgPathURL) {
                //加载图片
                document.all.IframeReportImg.src = imgPathURL;
            }
            else {
                //图片直接另存为
                DoSaveAsIMG();
            }
        }
        function DoSaveAsIMG() {
            if (document.all.IframeReportImg.src != 'about:blank')
            document.frames('IframeReportImg').document.execCommand('SaveAs');
        }
        //定时刷新
        var reinto={
            init:function(){
                this.clear();
                this.start();
            },
            start:function(){
                timer = setInterval(getList,20000);
            },
            clear:function(){
                if(timer){
                    clearInterval(timer);
                    timer = null;
                }
            }
        };
        //增删查改
        var SQL = {'pro':'CloudProject','pc':'CloudPanel','btn':'CloudKeypad','rmt':'CloudIR','pq':'CloudPQ','logo':'logo'};
        //列表页的操作
        function edit(){
            var col = ($('ul.nav-box li.focus').text().indexOf('星标')>=0||$('ul.nav-box li.focus').text().indexOf('常用')>=0)?'1':'';
            $("tbody a.btn-xs:last-child").hover(
                function(){
                    if($(this).children().attr('class').indexOf('glyphicon-star')<0){
                        return;
                    }
                    $(this).children().removeClass('glyphicon-star-empty').addClass('glyphicon glyphicon-star');
                },
                function(){
                    if($(this).children().attr('class').indexOf('glyphicon-star')<0){
                        return;
                    }
                    $(this).children().removeClass('glyphicon-star').addClass('glyphicon-star-empty');
                }
            );
            $("tbody a.btn-xs").click(function(e){
                var txt = '';
                var cla = $(this).children().attr('class');
                if ($(this).attr('href')==''){
                    e.preventDefault();
                }
                var rname = $(this).parent().parent().children('td:nth-child(2)').text();
                var ele = $(this).parent().parent();
                var row = ele.children('td:nth-child(1)').text();
                if ((cla.indexOf('plus'))>=0){
                    if(id=='#index'){
                        copyPro(row,ele.children('td:nth-child(1)').attr('flag'));
                        return;
                    }
                    txt = '复制';
                    if(id=='#LOGO'){
                        rname = $(this).parent().parent().children('td:nth-child(3)').text();
                    }
                    copy(rname);
                }else if(cla.indexOf('save')>=0){
                    txt = '下载';
                }else if(cla.indexOf('trash')>=0){
                    txt = '删除';
                    delet(row,ele,col);
                }else {
                    txt = '常用';
                    collect(row);
                }
                e.stopPropagation();
            });
            //复制
            function copy(rname){
                var ur=$(".content-body .content-nav .pull-right button.btn-success").attr('alrt');
                alertPei(ur,'',function(){
                    var id = $("#list").children().attr('id');
                    var data = {'SQL':id,'Rname':rname};
                    return look(data,id);
                });
            }
            function delet(row,ele,col){
                alertMsg({msg:'您真的要删除该行数据吗？',mEn:'Are you sure you want to delete the row data?'},function(){
                    $.ajax({
                        type:'POST',
                        url:'delet/',
                        data:{'SQL':SQL[table],'row':row,col:col,uid:uid},
                        success:function(txt){
                            if(txt=='ok'){
                                ele.remove();
                            }
                        }
                    });
                });
            }
            function collect(row){
                $.ajax({
                    type:'POST',
                    url:'addcol/',
                    data:{id:row,SQL:SQL[table],uid:uid},
                    success:function(txt){
                        alertMsg({msg:'常用成功！',mEn:'Common success!!'});
                    }
                })
            }
            //右键点击添加到
            if(user_author=='1'){
                $('tbody tr').contextMenu({
                    width: 120, // width
                    itemHeight: 30, // 菜单项height
                    bgColor: "#333", // 背景颜色
                    color: "#fff", // 字体颜色
                    fontSize: 12, // 字体大小
                    hoverColor: "#fff", // hover字体颜色
                    hoverBgColor: "#99CC66", // hover背景颜色
                    target: function(ele) { // 当前元素--jq对象
                        $('.ui-context-menu-item').attr('cid',ele.children('td:nth-child(1)').text())
                    },
                    menu: [{ // 菜单项
                        text: "添加到所有人常用",
                        callback: function() {
                            var cid = $('.ui-context-menu-item').attr('cid');
                            $.ajax({
                                type:'POST',
                                url:'colAll/',
                                data:{id:cid,val:'1',table:table,col:col,uid:uid},
                                success:function(txt){
                                    if(txt=='ok'){
                                        alertMsg({msg:'提交成功!!',mEn:'Add successfully!!',type:'sm'},function(){});
                                    }
                                }
                            });
                        }
                    },
                        {
                            text: "取消所有人常用",
                            callback: function() {
                                var cid = $('.ui-context-menu-item').attr('cid');
                                $.ajax({
                                    type:'POST',
                                    url:'colAll/',
                                    data:{id:cid,val:'0',table:table,col:col,uid:uid},
                                    success:function(txt){
                                        if(txt=='ok'){
                                            alertMsg({msg:'取消成功!!',mEn:'Cancel successfully!!',type:'sm'},function(){});
                                        }
                                    }
                                });
                            }
                        }
                    ]
                });
            }
        }
        //分页
        function pages(obts){
            var set = $.extend({table:table,uid:uid,col:'0',serch:''},obts||{});
            if($('.search-box input').val()!=''){
                set.serch = $(".search-type").attr('serch')+':'+$('.search-box input').val();
            }
            //动态展示页码
            $.ajax({
                type:'GET',
                url:'pages/',
                data:set,
                success:function(num){
                    var n = null;
                    var htm = '';
                    if(parseInt(num)>5){
                        n = 4;
                        htm = '<li><a href="#">...</a></li>\
                               <li page="'+num+'"><a href="#">'+num+'</a></li>';
                    }else{
                        n = parseInt(num);
                    }
                    if(num<=1){
                        $(".pagination").html('');
                        return;
                    }else{
                        var html='<li><a href="#" aria-label="Previous">&laquo;</a></li>\
                                <li><a href="#"><pre class="Chinese">上一页</pre><pre class="English">Prev</pre></a></li>';
                        for(var i=1;i<=n;i++){
                            if(i==1){
                                html+='<li class="active" page="1"><a href="#">1</a></li>';
                            }else{
                                html+='<li page="'+i+'"><a href="#">'+i+'</a></li>';
                            }
                        }
                        html += htm + '<li><a href="#"><pre class="Chinese">下一页</pre><pre class="English">Next</pre></a></li>\
                                <li><a href="#" aria-label="Next">&raquo;</a></li>';
                        $(".pagination").html(html);
                        clickpages(num);
                    }
                }
            });
            //跳转页面
            function clickpages(num){
                $(".pagination li").click(function(){
                            var txt = $(this).children('a').text();
                            var page = '',ele=null;
                            var page1 = parseInt($(".pagination li.active").attr('page'));
                            if(isNaN(parseInt(txt))){
                                switch (txt) {
                                    case '下一页Next':
                                        if(page1==num){
                                            return;
                                        }
                                        if(page1>=(num-2)||num<=5||page1<3){
                                            ele = $(".pagination li.active").next();
                                        }else{
                                            newPages('next',page1+1);
                                            ele = $(".pagination li.active");
                                        }
                                        break;
                                    case '上一页Prev':
                                        if(page1=='1'){
                                            return;
                                        }
                                        if(page1>=(num-1)||page1<=3||num<=5){
                                            ele = $(".pagination li.active").prev();
                                        }else{
                                            newPages('prev',page1-1);
                                            ele = $(".pagination li.active");
                                        }
                                        break;
                                    case '«':
                                        if(page1=='1'){
                                            return;
                                        }
                                        if(num>5){
                                            newPages('«',3);
                                        }
                                        ele = $(".pagination li[page=1]");
                                        break;
                                    case '»':
                                        if(page1==num){
                                            return;
                                        }
                                        if(num>5){
                                            newPages('»',num-3);
                                        }
                                        ele = $(".pagination li[page="+num+"]");
                                        break;
                                    case '...':
                                        JumpPages($(this),page1);
                                        return;
                                }
                            }else{
                                if((parseInt(txt)>=(num-3)||parseInt(txt)<=3)&&num>5){
                                    newPages('jump',parseInt(txt));
                                }
                                ele = $(this);
                            }
                            page = actPages(ele);
                            if(page!=''&&page!=page1){
                                getList({page:page});
                            }
                        });
                //active
                function actPages(ele){
                    ele.addClass('active').siblings().removeClass('active');
                    return $(".pagination li.active").text();
                }
                function  JumpPages(th,page1){
                    var html = '<div class="jumpbox">\
                                    <input type="text" id="jumpnum"><button class="btn btn-default btn-sm">GO</button>\
                                </div>';
                    if(!th.children('.jumpbox').attr('class')){
                        th.append(html);
                        $(".jumpbox button").click(function(){
                            var page=$(".jumpbox input").val();
                            if(isNaN(parseInt(page))){
                                return;
                            }else if(parseInt(page)<=num&&parseInt(page)>=1){
                                newPages('jump',parseInt(page));
                                if(page!=''&&page!=page1){
                                    getList({page:page});
                                }
                                th.children('.jumpbox').remove()
                            }
                        });
                    }
                }
                //newpages
                function newPages(type,i){
                    var html = "";
                    switch (type) {
                        case "next":
                            if(i>(num-3)){
                                html = '<li><a href="#" aria-label="Previous">&laquo;</a></li>\
                                    <li><a href="#"><pre class="Chinese">上一页</pre><pre class="English">Prev</pre></a></li>\
                                    <li page="1"><a href="#">1</a></li>\
                                    <li><a href="#">...</a></li>\
                                    <li page="'+(i-1)+'"><a href="#">'+(i-1)+'</a></li>\
                                    <li class="active" page="'+i+'"><a href="#">'+i+'</a></li>\
                                    <li page="'+(i+1)+'"><a href="#">'+(i+1)+'</a></li>\
                                    <li page="'+num+'"><a href="#">'+num+'</a></li>\
                                    <li><a href="#"><pre class="Chinese">下一页</pre><pre class="English">Next</pre></a></li>\
                                    <li><a href="#" aria-label="Next">&raquo;</a></li>';
                            }else{
                                html = '<li><a href="#" aria-label="Previous">&laquo;</a></li>\
                                    <li><a href="#"><pre class="Chinese">上一页</pre><pre class="English">Prev</pre></a></li>\
                                    <li page="1"><a href="#">1</a></li>\
                                    <li><a href="#">...</a></li>\
                                    <li page="'+(i-1)+'"><a href="#">'+(i-1)+'</a></li>\
                                    <li class="active" page="'+i+'"><a href="#">'+i+'</a></li>\
                                    <li page="'+(i+1)+'"><a href="#">'+(i+1)+'</a></li>\
                                    <li><a href="#">...</a></li>\
                                    <li page="'+num+'"><a href="#">'+num+'</a></li>\
                                    <li><a href="#"><pre class="Chinese">下一页</pre><pre class="English">Next</pre></a></li>\
                                    <li><a href="#" aria-label="Next">&raquo;</a></li>';
                            }
                        break;
                        case "prev":
                            if(i<4){
                                html = '<li><a href="#" aria-label="Previous">&laquo;</a></li>\
                                    <li><a href="#"><pre class="Chinese">上一页</pre><pre class="English">Prev</pre></a></li>\
                                    <li page="1"><a href="#">1</a></li>\
                                    <li page="2"><a href="#">2</a></li>\
                                    <li class="active" page="3"><a href="#">3</a></li>\
                                    <li page="4"><a href="#">4</a></li>\
                                    <li><a href="#">...</a></li>\
                                    <li page="'+num+'"><a href="#">'+num+'</a></li>\
                                    <li><a href="#"><pre class="Chinese">下一页</pre><pre class="English">Next</pre></a></li>\
                                    <li><a href="#" aria-label="Next">&raquo;</a></li>';
                            }else{
                                html = '<li><a href="#" aria-label="Previous">&laquo;</a></li>\
                                    <li><a href="#"><pre class="Chinese">上一页</pre><pre class="English">Prev</pre></a></li>\
                                    <li page="1"><a href="#">1</a></li>\
                                    <li><a href="#">...</a></li>\
                                    <li page="'+(i-1)+'"><a href="#">'+(i-1)+'</a></li>\
                                    <li class="active" page="'+i+'"><a href="#">'+i+'</a></li>\
                                    <li page="'+(i+1)+'"><a href="#">'+(i+1)+'</a></li>\
                                    <li><a href="#">...</a></li>\
                                    <li page="'+num+'"><a href="#">'+num+'</a></li>\
                                    <li><a href="#"><pre class="Chinese">下一页</pre><pre class="English">Next</pre></a></li>\
                                    <li><a href="#" aria-label="Next">&raquo;</a></li>';
                            }
                            break;
                        case "«" :
                            html = '<li><a href="#" aria-label="Previous">&laquo;</a></li>\
                                    <li><a href="#"><pre class="Chinese">上一页</pre><pre class="English">Prev</pre></a></li>\
                                    <li class="active" page="1"><a href="#">1</a></li>\
                                    <li page="2"><a href="#">2</a></li>\
                                    <li page="3"><a href="#">3</a></li>\
                                    <li page="4"><a href="#">4</a></li>\
                                    <li><a href="#">...</a></li>\
                                    <li page="'+num+'"><a href="#">'+num+'</a></li>\
                                    <li><a href="#"><pre class="Chinese">下一页</pre><pre class="English">Next</pre></a></li>\
                                    <li><a href="#" aria-label="Next">&raquo;</a></li>';
                            break;
                        case "»" :
                            html = '<li><a href="#" aria-label="Previous">&laquo;</a></li>\
                                    <li><a href="#"><pre class="Chinese">上一页</pre><pre class="English">Prev</pre></a></li>\
                                    <li page="1"><a href="#">1</a></li>\
                                    <li><a href="#">...</a></li>\
                                    <li page="'+(num-3)+'"><a href="#">'+(num-3)+'</a></li>\
                                    <li page="'+(num-2)+'"><a href="#">'+(num-2)+'</a></li>\
                                    <li page="'+(num-1)+'"><a href="#">'+(num-1)+'</a></li>\
                                    <li class="active" page="'+num+'"><a href="#">'+num+'</a></li>\
                                    <li><a href="#"><pre class="Chinese">下一页</pre><pre class="English">Next</pre></a></li>\
                                    <li><a href="#" aria-label="Next">&raquo;</a></li>';
                            break;
                        case "jump" :
                            var htm = '';
                            if(i>=(num-3)){
                                for (var n=3;n>=0;n--){
                                    var ht = '<li page="'+(num-n)+'"><a href="#">'+(num-n)+'</a></li>';
                                    if (i==num-n){
                                        ht = '<li class="active" page="'+(num-n)+'"><a href="#">'+(num-n)+'</a></li>'
                                    }
                                    htm += ht;
                                }
                                html = '<li><a href="#" aria-label="Previous">&laquo;</a></li>\
                                    <li><a href="#"><pre class="Chinese">上一页</pre><pre class="English">Prev</pre></a></li>\
                                    <li page="1"><a href="#">1</a></li>\
                                    <li><a href="#">...</a></li>\
                                    '+htm+'\
                                    <li><a href="#"><pre class="Chinese">下一页</pre><pre class="English">Next</pre></a></li>\
                                    <li><a href="#" aria-label="Next">&raquo;</a></li>';
                                i = 5;
                            }else if(i<=4){
                                for (var n=1;n<=4;n++){
                                    var ht = '<li page="'+n+'"><a href="#">'+n+'</a></li>';
                                    if (i==n){
                                        ht = '<li class="active" page="'+n+'"><a href="#">'+n+'</a></li>'
                                    }
                                    htm += ht;
                                }
                                html = '<li><a href="#" aria-label="Previous">&laquo;</a></li>\
                                    <li><a href="#"><pre class="Chinese">上一页</pre><pre class="English">Prev</pre></a></li>\
                                    '+htm+'\
                                    <li><a href="#">...</a></li>\
                                    <li  page="'+num+'"><a href="#">'+num+'</a></li>\
                                    <li><a href="#"><pre class="Chinese">下一页</pre><pre class="English">Next</pre></a></li>\
                                    <li><a href="#" aria-label="Next">&raquo;</a></li>';
                                i=5;
                            }else{
                                html = '<li><a href="#" aria-label="Previous">&laquo;</a></li>\
                                    <li><a href="#"><pre class="Chinese">上一页</pre><pre class="English">Prev</pre></a></li>\
                                    <li><a href="#">...</a></li>\
                                    <li page="'+(i-1)+'"><a href="#">'+(i-1)+'</a></li>\
                                    <li class="active" page="'+i+'"><a href="#">'+i+'</a></li>\
                                    <li page="'+(i+1)+'"><a href="#">'+(i+1)+'</a></li>\
                                    <li><a href="#">...</a></li>\
                                    <li  page="'+num+'"><a href="#">'+num+'</a></li>\
                                    <li><a href="#"><pre class="Chinese">下一页</pre><pre class="English">Next</pre></a></li>\
                                    <li><a href="#" aria-label="Next">&raquo;</a></li>';
                            }
                    }
                    
                    if(num>5||num<3) {
                        $(".pagination").html(html);
                        clickpages(num);
                    }
                }
            }
        }
        //排序
        function Sort(val){
            var sort = '-id';
            if (val == "按名字排序"){
                sort = $("thead th:nth-child(2)").attr('serch');
            }
            getList({sort:sort});
        }
        //跳转到项目页
        function goProject(val,groupList,fn){
            var yunList = null;
            if (val==''){
                return;
            }
            $.ajax({
                type:'POST',
                url:'newProject/',
                data:{'platename':val,'uid':uid},
                dataType:'json',
                success:function (data){
                    groupList = data;
                },
                error:function (){

                }
            });
            $.ajax({
                type:'POST',
                url:'newProject/',
                data:{'platename':val,'uid':'all'},
                dataType:'json',
                success:function (data){
                    yunList = data;
                },
                error:function (){

                }
            });
            Array.prototype.removeByValue = function(val) {
                for(var i=0; i<this.length; i++) {
                    if(this[i] == val) {
                        this.splice(i, 1);
                        break;
                    }
                }
            };
            Array.prototype.removeObValue = function(val) {
                for(var i=0; i<this.length; i++) {
                    if(this[i]['logo_name'] == val) {
                        this.splice(i, 1);
                        break;
                    }
                }
            };
            //加载云配置
            var upLoad = {
                name:null,
                i:null,
                key:null,
                init:function(name){
                    if (name=='logo_name'){
                        name = 'logo';
                    }
                    this.name = name;
                    this.editlist();
                    this.showLeft();
                    this.showRight();
                    this.goList();
                },
                showLeft:function(){
                    var html = this.getHtml(groupList);
                    $('#selectModal ul.select-left').html(html);
                },
                showRight:function(){
                    var html = this.getHtml(yunList);
                    $('#selectModal ul.select-right').html(html);
                },
                getHtml:function(configlist){
                    var html = '';
                    $.each(configlist,function(i){
                        $.each(configlist[i],function(key){
                            if(key==upLoad.name){
                                var list = configlist[i][key];
                                upLoad.i = i;
                                upLoad.key = key;
                                $.each(list,function(p){
                                    if(key=='logo'&&list[p]){
                                        html += '<li>'+list[p]['logo_name']+'</li>';
                                    } else{
                                        html += '<li>'+list[p]+'</li>';
                                    }
                                });
                                return false;
                            }
                        });
                    });
                    return html;
                },
                goList:function(){
                    $('#selectModal ul li').click(function(){
                        $(this).toggleClass('active');
                    });
                    $('#selectModal ul li').dblclick(function(){
                        var val = $(this).text();
                        if (upLoad.key=='logo'){
                            var OBval = null;
                            if($(this).parent().attr('class')=='select-left'){
                                for(var i=0;i<groupList[upLoad.i][upLoad.key].length;i++){
                                    if(groupList[upLoad.i][upLoad.key][i]['logo_name']==val){
                                        OBval=groupList[upLoad.i][upLoad.key][i];
                                    }
                                }
                                yunList[upLoad.i][upLoad.key].push(OBval);
                                groupList[upLoad.i][upLoad.key].removeObValue(val);
                            }else{
                                for(var i=0;i<yunList[upLoad.i][upLoad.key].length;i++){
                                    if(yunList[upLoad.i][upLoad.key][i]['logo_name']==val){
                                        OBval=yunList[upLoad.i][upLoad.key][i];
                                    }
                                }
                                groupList[upLoad.i][upLoad.key].push(OBval);
                                yunList[upLoad.i][upLoad.key].removeObValue(val);
                            }
                        }else if($(this).parent().attr('class')=='select-left'){
                            groupList[upLoad.i][upLoad.key].removeByValue(val);
                            yunList[upLoad.i][upLoad.key].push(val);
                        }else {
                            yunList[upLoad.i][upLoad.key].removeByValue(val);
                            groupList[upLoad.i][upLoad.key].push(val);
                        }
                        upLoad.init(upLoad.name);
                    });
                    $('#selectModal .btn-edit button').click(function(){
                        var txt = $(this).text();
                        switch (txt) {
                            case '>':
                                th($('#selectModal ul.select-left li.active'),'right');
                                break;
                            case '<':
                                th($('#selectModal ul.select-right li.active'),'left');
                                break;
                            case '>>':
                                th($('#selectModal ul.select-left li'),'right');
                                break;
                            case '<<':
                                th($('#selectModal ul.select-right li'),'left');
                                break;
                        }
                    });
                    function th(list,s){
                        if(!list){
                            return;
                        }
                        list.each(function(){
                            var val = $(this).text();
                            if (upLoad.key=='logo'){
                                var OBval = null;
                                if(s=='left'){
                                    for(var i=0;i<yunList[upLoad.i][upLoad.key].length;i++){
                                        if(yunList[upLoad.i][upLoad.key][i]['logo_name']==val){
                                            OBval=yunList[upLoad.i][upLoad.key][i];
                                        }
                                    }
                                    groupList[upLoad.i][upLoad.key].push(OBval);
                                    yunList[upLoad.i][upLoad.key].removeObValue(val);
                                }else if(s=='right'){
                                    for(var i=0;i<groupList[upLoad.i][upLoad.key].length;i++){
                                        if(groupList[upLoad.i][upLoad.key][i]['logo_name']==val){
                                            OBval=groupList[upLoad.i][upLoad.key][i];
                                        }
                                    }
                                    yunList[upLoad.i][upLoad.key].push(OBval);
                                    groupList[upLoad.i][upLoad.key].removeObValue(val);
                                }
                            }else if(s=='left'){
                                yunList[upLoad.i][upLoad.key].removeByValue(val);
                                groupList[upLoad.i][upLoad.key].push(val);
                            }else if(s=='right'){
                                groupList[upLoad.i][upLoad.key].removeByValue(val);
                                yunList[upLoad.i][upLoad.key].push(val);
                            }
                        });
                        $('#selectModal .btn-edit button').unbind('click');
                        upLoad.init(upLoad.name);
                    }
                },
                editlist:function(){
                    $.each(groupList,function(i){
                        $.each(groupList[i],function(key){
                            var list = groupList[i][key];
                            if(key=='logo'){
                                $.each(list, function (p) {
                                    yunList[i][key].removeObValue(list[p]['logo_name']);
                                });
                            }
                            else {
                                $.each(list, function (p) {
                                    yunList[i][key].removeByValue(list[p]);
                                });
                            }
                        });
                    });
                }
            };
            $(".content-title h3").children('pre.Chinese').text('新建项目');
            $(".content-title h3").children('pre.English').text('New Project');
            $(".content-body").html('').load('static/data/data/project.html', function () {
                $(".content").removeClass('active');
                adminHtml('project',$("div.adminNeed"));
                $("#showCheck").click(function(){
                    if($(this).find('input[type=checkbox]').is(':checked')){
                        $(this).parents('.row').siblings('.row').show()
                    }else{
                        $(this).parents('.row').siblings('.row').hide()
                    }
                });
                $("#listEdit ul li").remove();
                reinto.clear();
                var pq= {};
                if(fn){
                    pq = fn();
                }
                //项目页保存配置
                $("div.custom div.custom-btn button.btn-success").click(function(){
                    var form = $(this).parent().parent().find('form');
                    var table = $(this).parent().parent().attr('id');
                    var tabl = table;
                    if(table == 'fu-remote'){
                        tabl = 'CloudIR';
                    }
                    var formJson = form.serializeJson();
                    if(table == 'CloudPQ'){
                        formJson = pq;
                    }
                    var statu = true,Msg='',mEn='';
                    //判断是否为空
                    var name_val = $(this).parent().parent().find(".custom-content div:first-child input").val();
                    if(name_val==''){
                        statu = false;
                        Msg = $(".custom-content div:first-child input").prev().text()+'不能为空！！';
                        mEn = $(".custom-content div:first-child input").prev().text()+' can not be empty!!';
                    };
                    if(statu==true){
                        if(testREX.name.test(name_val)){
                            statu = false;
                            Msg = $(".custom-content div:first-child input").prev().text()+'不能包含：\\ / : * \" ? < > |以及中文字符！！';
                            mEn = $(".custom-content div:first-child input").prev().text()+' does not contain: \ \ \ "/: *? < > | and Chinese character!!';
                        }
                    }
                    if(statu==true&&tabl=='CloudIR'){
                        var oneMsg=IRM($("#"+table+" input[type=text]"),'遥控中的','First IR ');
                        statu = oneMsg.statu;
                        Msg = oneMsg.Msg;
                        mEn = oneMsg.mEn;
                    }
                    if(statu==false){
                        alertMsg({title:'错误',msg:Msg,mEn:mEn},function(){
                            return;
                        });
                        return;
                    }
                    //判断名称是否存在
                    if(statu==true){
                        $.ajax({
                            type:'POST',
                            url:'testName/',
                            data:{SQL:tabl,name:name_val},
                            success:function(text){
                                if(text=='err'){
                                    statu = false;
                                    Msg = '该名称已经有人使用了，请更换哟';
                                    mEn = 'The name is already in use. Please replace it!!';
                                }
                                peiAjax(statu,Msg,mEn);
                            }
                        });
                        return;
                    }
                    peiAjax(statu,Msg);
                    function peiAjax(statu,Msg,mEn){
                        if(statu==false){
                            alertMsg({title:'错误',msg:Msg,mEn:mEn},function(){
                                return;
                            });
                            return;
                        }
                        alertMsg({title:'提示',msg:'正在提交中......',mEn:'In submission......'},function(){

                        });
                        formJson['table']=tabl;
                        formJson['Author_id']=uid;
                        formJson[tabl.replace('Cloud','')+'Time']=nowtime();
                        formdata({
                            data: formJson,
                            type:'post',
                            url:'addCloud/',
                            fn: function(){
                                alertMsg({title:'提示',msg:'提交成功!!!'},function(){

                                });
                            }
                        });
                    }
                });
                //
                $('input[name=panel_out_timing_mode]').click(function(){
                    var val = $(this).attr('val').split('|');
                    var html = '<ul class="selector" style="display: none;">';
                    $.each(val,function(p){
                        html+='<li>'+val[p]+'</li>'
                    });
                    html += '</ul>';
                    if ($(this).parent().siblings("ul").attr('class') == 'selector') {
                        $(this).parent().siblings(".selector").slideUp('fast', function () {
                            $(this).remove();
                        });
                        return;
                    }
                    $(this).parent().parent().append(html);
                    $(".selector").attr('drop-on', '0');
                    $(".selector").css('bottom','100%');
                    $(".selector li").click(function(){
                        var val = $(this).text();
                        $('input[name=panel_out_timing_mode]').val(val);
                        $(this).parent().slideUp('fast', function () {
                            $(this).remove();
                        });
                    });
                    $(this).parent().siblings(".selector").attr('drop-on', '1').slideDown('100');
                });
                $("#project-modal").modal('hide');
                $(".pro-box label.input-group[drop-down=1]>input:not(#language)").blur(function () {
                    if ($(this).parent().siblings("ul").attr('class') == 'selector') {
                        $(this).parent().siblings(".selector").slideUp('fast', function () {
                            $(this).remove();
                        });
                        return;
                    }
                });
                //
                var language_list=[];
                $(".pro-box label.input-group[drop-down=1]>input").focus(function () {
                    var id=$(this).attr('id');
                    if (id=='logo_name'){
                        id = 'logo';
                    }
                    var val = $(this).val();
                    var th = $(this);
                    var html = '<ul class="selector" style="display: none;">';
                    if (id=='logo'){
                        html += '<li logo-src=""></li>';
                    }
                    $.each(groupList,function(i){
                        $.each(groupList[i],function(key){
                            if(id==key||id=='default_language'||id=='logo_name'){
                                var value = groupList[i][key];
                                if(id=='default_language'){
                                    var value = language_list;
                                }
                                $.each(value,function(p){
                                    if(id=='logo'){
                                        if(val.indexOf(value[p])>=0){
                                            html += '<li class="active" logo-src="'+value[p]['logo_src']+'">'+value[p]['logo_name']+'</li>';
                                        }else{
                                            html += '<li logo-src="'+value[p]['logo_src']+'">'+value[p]['logo_name']+'</li>';
                                        }
                                    }else if(id=='board_type'){
                                        if(val.indexOf(value[p])>=0){
                                            html += '<li class="active" img1="'+value[p]['1']+'" img2="'+value[p]['2']+'">'+value[p]['0']+'</li>';
                                        }else{
                                            html += '<li img1="'+value[p]['1']+'" img2="'+value[p]['2']+'">'+value[p]['0']+'</li>';
                                        }
                                    }else if(val.indexOf(value[p])>=0){
                                        html += '<li class="active">'+value[p]+'</li>';
                                    }else{
                                        html += '<li>'+value[p]+'</li>';
                                    }
                                });
                                if (th.parents('div.col-xs-6').next().find('button').text()||id=='logo'){
                                    html += '<li>更多...</li>'
                                }
                                return false;
                            }
                        });
                        if(id=='default_language'){
                            return false;
                        }
                    });
                    html += '</ul>';
                    if ($(this).parent().siblings("ul").attr('class') == 'selector') {
                        $(this).parent().siblings(".selector").slideUp('fast', function () {
                            $(this).remove();
                        });
                        return;
                    }
                    $(this).parent().parent().append(html);
                    $(".selector").attr('drop-on', '0');
                    $('.selector').css('top','92%');
                    $(this).parent().siblings(".selector").attr('drop-on', '1').slideDown('100');
                    if($("label.input-group input#language").val()!=''){
                        language_list=$("label.input-group input#language").val().split(',');
                    }
                });
                //
                $("body").mousedown(function(e){
                    if($(e.target).attr('id')=='language'||$(e.target).parent().attr('class')=='selector'){
                        return;
                    }else{
                        $("label.input-group[drop-down=1] input#language").parent().siblings(".selector").slideUp('fast', function () {
                            $(this).remove();
                        });
                    }
                    if($(e.target).attr('id')=='logo'||$(e.target).parent().attr('class')=='df_logo'){
                        return;
                    }else{
                        $('#d_logo').hide();
                    }
                });
                //
                $("label.input-group[drop-down=1] input:not(#language)").keyup(function(){
                    var val=$(this).val();
                    if(val==''){
                        $(".selector li").show();
                        return;
                    }
                    $(".selector li").each(function(){
                        var v=$(this).text();
                        if(v.indexOf(val)<0){
                            $(this).hide();
                        }else{
                            v.replace(val,"<span style='color:red;'>"+val+"</span>");
                            $(this).html(v);
                        }
                    });
                });
                $(".pro-box").mousedown('.selector li', function (e) {
                    if (e.target.nodeName == 'LI') {
                        $("label.input-group[drop-down=1] input").blur();
                        var text = $(e.target).text();
                        var input = $(e.target).parent().siblings('label').children('.form-control');
                        if(text=='更多...'){
                            $("#selectModal").modal('show');
                            upLoad.init(input.attr('name'));
                            return;
                        }
                        $(e.target).toggleClass('active');
                        if(input.attr('id')=='language'){
                            if($(e.target).attr('class')=='active'){
                                language_list.push(text);
                            }else{
                                language_list.splice($.inArray(text,language_list),1);
                            }
                        }
                        if(input.attr('id')=='logo_name'){
                            $('#logo').val($(e.target).attr('logo-src'));
                            if($(e.target).attr('logo-src') !=''){
                                var html = '<img id="loMsg" style="width: 300px;" src="media/'+$(e.target).attr('logo-src')+'">';
                                $('#LogoMsg').html(html);
                            }
                        }
                        if(input.attr('id')=='language'&&input.val()!=''){
                            input.val(language_list);
                            input.attr('title',language_list)
                        }else{
                            input.val(text);
                            input.attr('title',text);
                            if (input.attr('id')=='board_type'&&$(e.target).attr('img1')!=''){
                                var html = '<img style="width: 350px" src="media/'+$(e.target).attr('img1')+'"/>\
                                            <img style="width: 350px" src="media/'+$(e.target).attr('img2')+'"/>';
                                $('#boardMsg').html(html);
                            }
                        }
                        var id = $(e.target).parent().parent().next().children().attr('drop-alert');
                        var rn=sessionStorage.getItem(id);
                        if(rn!=text){
                            sessionStorage.removeItem(id);
                            rn=null;
                        }
                        if((rn==null)&&(text!='')){
                            sessionStorage.setItem(id,text);
                            var data={"SQL":id,"Rname":text};
                            if(id=='CloudPQ'){
                                pq = look(data,id);
                            }else{
                                look(data,id);
                            }

                        }else{

                        }
                    }
                });
                //PQ
                //
                $(".drop-alert").click(function () {
                    var id = $(this).attr('drop-alert');
                    $("#" + id).show().siblings('div').hide();
                    $(".custom-bg").show();
                    $(".custom").css('margin-right', '0px');
                });
                $(".drop-alert").parent().prev().find('input').keyup(function(){
                    //当选项为空的时候清空数据
                    if($(this).val()==''){
                        var id=$(this).parent().parent().next().find('.drop-alert').attr('drop-alert')
                        $("#"+id+" input[type=text]").val('');
                    }
                });
                //
                $(".custom-bg").click(function () {
                    var val = $('.custom>div[style=""] div.custom-content>div:nth-child(1) input').val();
                    var id=$('.custom>div[style=""]').attr('id');
                    $('.drop-alert[drop-alert='+id+']').parent().prev().children().children('input').val(val);
                    sessionStorage.setItem(id,val);
                    $(this).hide();
                    $(".custom").removeAttr('style');
                });
                //
                $("#CloudKeypad div .btn-xs").tinyDraggable({handle: 0, exclude: 0}, ddown);
                //遥?兀????遥??
                $("#CloudIR .IRshow button,#fu-remote .IRshow button").click(function(){
                    if($(this).attr('shows')=='1'){
                        $(this).parent().next().slideUp();
                        $(this).attr('shows','0').children('span').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
                    }else{
                        $(this).parent().next().slideDown();
                        $(this).attr('shows','1').children('span').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
                    }
                });
                $("#uplogo").uploadPreview({
                    Msg:'LogoMsg',
                    Img:'loMsg',
                    Width:300,
                    imgSize:255,
                    Callback:function(){
                        var val = $('#uplogo').val().split('\\');
                        val = val[val.length-1];
                        $('.logo-text').val(val).parent().parent().append('<div class="logoClose"><span class="glyphicon glyphicon-remove-sign"></span></div>');
                        $('.logoClose').click(function(){
                            $('#logo').val('');
                            $('.logo-text').val('');
                            $('#uplogo').val('');
                            $('#LogoMsg').html('');
                            $(this).remove();
                        });
                    }
                });

                $(".pro-box .col-lg-3").on("mousedown",'div.logoClose',function(e){
                    $(this).siblings('label').children('div').text('').next().val('');
                    $(this).prev().html('');
                    $(this).remove();
                });
                $("#pro_sub").click(function(){
                    var statu = true,Msg='',mEn='';
                    //判断是否为空
                    $("span.label-title span:contains('*')").each(function(){
                        if($(this).parents('.text-right').next().find('input').val()==''){
                            statu = false;
                            Msg = $(this).parent().text()+'不能为空！！';
                            mEn = $(this).parent().text()+' can not be empty！！';
                            return;
                        }
                    });
                    if(statu==true){
                        $("div.custom-content span:contains('名称')").each(function(){
                            if(testREX.name.test($(this).next().val())){
                                statu = false;
                                Msg = $(this).parents('.custom-content').parent().find('.custom-title h5 pre.Chinese').text()+'中的'+$(this).text()+'不能包含：\\ / : * \" ? < > |以及中文字符！！';
                                mEn = $(this).parents('.custom-content').parent().find('.custom-title h5 pre.English').text()+$(this).text()+' does not contain: \ \ \ "/: *? < > | and Chinese character!!';
                                return;
                            }
                        });
                    }
                    if(statu==true){
                        var oneMsg=IRM($("#CloudIR input[type=text]"),'自定义遥控中的','Custom IR');
                        statu = oneMsg.statu;
                        Msg = oneMsg.Msg;
                        mEn = oneMsg.mEn;
                    }
                    if(statu==true){
                        var twoMsg=IRM($("#fu-remote input[type=text]"),'自定义副遥控中的','Custom second IR');
                        statu = twoMsg.statu;
                        Msg = twoMsg.Msg;
                        mEn = oneMsg.mEn;
                    }
                    if(statu==true){
                        if($("#CloudIR input[name=remote_head_code]").val()==$("#fu-remote input[name=remote_head_code]").val()){
                            statu = false;
                            Msg = "主摇控器与副遥控器的头码不能相同！！";
                            mEn = "The head code can not be the first IR and second IR of the same side !!";
                        }
                    }
                    if(statu==false){
                        alertMsg({title:'错误',msg:Msg,mEn:mEn},function(){
                            return false;
                        });
                        return;
                    }
                    if(statu==true){
                        Msg = '<div>\
                              <p>版型:'+$('#board_type').val()+' &nbsp;</p> \
                              <p> 制式:'+$('#tv_system').val()+' &nbsp;</p> \
                              <p> 上电模式:'+$('#power_on_mode').val()+' &nbsp;</p> \
                              <p> 默认语言:'+$('#default_language').val()+' &nbsp;</p> \
                              <p> 遥控:'+$('#frist_remote').val()+' &nbsp;</p> \
                              <p> 遥控头码:'+$('#CloudIR input[name=remote_head_code]').val()+' &nbsp;</p> \
                              <p> 按键:'+$('#keypad_name').val()+' &nbsp;</p> \
                              <p> 屏幕参数:'+$('#panel_name').val()+' &nbsp;</p> \
                              <p> PQ:'+$('#pq_name').val()+' &nbsp;</p> \
                            </div>';
                        Msg += '<div class="text-center"><input type="checkbox" checked id="readMsg"/> <span>我已阅读<a target="_blank" href="mianze.html">中山志源公司服务条款</a></span></div>';
                        alertMsg({title:'提示',msg:Msg,type:'sm'},function(){
                            var statu = null;
                            if($('#readMsg').is(':checked')){
                                statu =true;
                            }else{
                                statu = false;
                                return false;
                            }
                            if(statu == false){
                                return;
                            }
                            var form = {};
                            $('form').each(function(){
                                var f = $(this).serializeJson();
                                var fo = $(this).serializeJson();
                                var key = $(this).attr('id');
                                $.each(f,function(i){
                                    if(f[i]!=''){
                                        $.each(fo,function(k){
                                            form[key+'['+k+']'] = fo[k];
                                        });
                                        return false;
                                    }
                                });
                            });
                            $.each(pq,function(i){
                                form['CloudPQ['+i+']'] = pq[i];
                            });
                            form['user_id'] = uid;
                            form['prolist[projectTime]'] = nowtime();
                            form['prolist[project_flag]'] = val;
                            var file = null;
                            if($('#uplogo').val()!=''){
                                file = $('#uplogo');
                            }else{
                                form['logo'] = $('#logo').val();
                            }
                            alertClass({type:'sm',title:'提示',msg:'正在提交中...',mEn:'In submission......'});
                            formdata({
                                 type:"post",
                                 url:"add_pro/",
                                 data:form,
                                 file:file,
                                 fn:function(txt){
                                     alertClass({title:'提示'},function(){
                                        window.location.reload();
                                     });
                                 }
                             });
                        });
                    }
                });
            });
        }
        //新建项目页
        function pro() {
            /**********************/
            if($(".content").attr('id')=='index'){
                $("#goProject").click(function () {
                    var groupList=null;
                    var val = $("#platename").val();
                    goProject(val,groupList,function(){
                        $("#logo_name").hover(
                            function(){
                                if($('#logo_name').val()!=''){
                                    $('#LogoMsg').show();
                                }
                            },
                            function(){
                                $('#LogoMsg').hide();
                            }
                        );
                        $("#board_type").hover(
                            function(){
                                if($('#board_type').val()!=''){
                                    $('#boardMsg').show();
                                }
                            },
                            function(){
                                $('#boardMsg').hide();
                            }
                        );
                    });
                });
            }
            //??
            //?????目
            $.ajax({
                type:'GET',
                url:'getProSys/',
                success:function(data){
                    var html = '';
                    $.each(data,function(p){
                        html += '<li><a href="#">'+data[p].project_name+'</a></li>'
                    });
                    $("#project-modal ul.dropdown-menu").html(html);
                    $(".plate ul li").click(function () {
                        var plate = $(this).children('a').html();
                        $("#platename").val(plate);
                    });
                }
            });
        }
        //?幕???页
        function pc(){

        }
        //????页
        function btn(){
            
        }
        //遥???
        function rmt(){

        }
        //图?效??页
        function pq(){

        }
        //logo列表
        function lg(){

        }
        //一级页面搜索
        var search = {
            list:{},
            init:function(){
                var df = $('thead th:nth-child(2)');
                $('.search-type').html(df.html()).attr('serch',df.attr('serch'));
                this.gettitle();
                this.showList();
                this.goserch();
            },
            gettitle:function(){
                this.list = new obj();
                $('thead th:not(.hide)').each(function(){
                    if($(this).text()!='编译状态'&&$(this).attr('serch')){
                        search.list[$(this).attr('serch')]=$(this).html();
                    }
                });
            },
            showList:function(){
                $('.search-box .btn-group button').click(function(){
                    var html = '';
                    $.each(search.list,function(i){
                        html += '<li serch="'+i+'">'+search.list[i]+'</li>';
                    });
                    html = '<ul>'+html+'</ul>';
                    $(this).parent().append(html).children('ul').slideDown('fast');
                    search.hideList();
                    search.intoInput();
                });
            },
            hideList:function(){
                $('.search-box .btn-group').mouseleave(function(){
                    if($('.search-box .btn-group ul')){
                        $('.search-box .btn-group ul').slideUp('fast');
                    }
                });
            },
            intoInput:function(){
                $('.search-box .btn-group ul li').click(function(){
                    var df = $(this);
                    $('.search-type').html(df.html()).attr('serch',df.attr('serch'));
                });
            },
            goserch:function(){
                $('.search-box input').keyup(function(){
                    getList();
                    pages();
                });
            }
        };
        //批量下载添加删除
        var editlist = {
            idlist : null,
            table:null,
            col:null,
            init : function(table){
                this.idlist = new Array();
                this.table = table;
                this.showMune();
                this.toggleClass();
                this.removeid();
                this.edit();
            },
            toggleClass:function(){
                $("tbody tr").click(function(){
                    if($(this).attr('colAll')=='1'){
                        return;
                    }
                    $(this).toggleClass('act');
                    var pid = $(this).children('td:first-child').html();
                    if($(this).attr('class')==''){
                        editlist.idlist.splice($.inArray(pid,editlist.idlist),1);
                    }else{
                        editlist.idlist.push(pid);
                    }
                    $("#listEdit ul span.badge").html(editlist.idlist.length);
                });
            },
            showMune:function(){
                var html = '<li>\
                            <button class="btn btn-xs btn-default" type="button">\
                            清空 <span class="badge">0</span>\
                            </button>\
                        </li>';
                $("tbody tr:first-child td:last-child span").each(function(){
                    if($(this).attr('class').indexOf('plus')<0){
                        html += '<li><a href="" class="btn btn-sm btn-default"><span class="'+$(this).attr('class')+'"></span></a></li>';
                    }
                });
                var col = ($('ul.nav-box li.focus').text().indexOf('星标')>=0||$('ul.nav-box li.focus').text().indexOf('常用')>=0)?'1':'';
                if(col=='1'&&html.indexOf('glyphicon-trash')<0){
                    html += '<li><a href="" class="btn btn-sm btn-default"><span class="glyphicon glyphicon-trash"></span></a></li>';
                }
                $("#listEdit ul").html(html);
            },
            removeid:function(){
                $("#listEdit ul li:first-child").click(function(){
                    editlist.idlist = new Array();
                    $("tbody tr.act").removeClass('act');
                    $("#listEdit ul span.badge").html(editlist.idlist.length);
                });
            },
            edit:function(){
                $("#listEdit ul li").click(function(e){
                    if ($(".content .content-nav ul.nav-box li.focus").html().indexOf('星标')>=0||$(".content .content-nav ul.nav-box li.focus").html().indexOf('常用')>=0){
                        editlist.col += uid;
                    }else{
                        editlist.col = '';
                    }
                    e.preventDefault();
                    var s = $(this).find('span').attr('class');
                    if(editlist.idlist.length==0){
                        return;
                    }
                    if(s.indexOf('save')>=0){
                        editlist.saveList();
                    }else if(s.indexOf('trash')>=0){
                        alertMsg({title:'提示',msg:'真的要删除吗？!!',mEn:'Do you really want to delete it?'},function(){
                            editlist.removeList()
                        });
                    }else if(s.indexOf('star')>=0){
                        editlist.colList()
                    }
                });
            },
            saveList:function(){
                $.ajax({
                    type:'POST',
                    url:'savelist/',
                    data:{'pid':editlist.idlist,'col':editlist.col},
                    success:function(data){
                        var key = 'project_file';
                        $.each(data,function(i){
                            downloadFile(data[i][key]);
                        });
                    },
                    error:function(){

                    }
                })
            },
            removeList:function(){
                $.ajax({
                    type:'POST',
                    url:'removeList/',
                    data:{'pid':editlist.idlist,'col':editlist.col,'table':editlist.table},
                    success:function(txt){
                        $('#alertMsg').modal('hide');
                        if(txt=='ok'){
                            alertMsg({title:'提示',msg:'删除成功!!',mEn:'Delete successfully!!',type:'sm'},function(){
                                getList();
                            })
                        }
                    },
                    error:function(){

                    }
                })
            },
            colList:function(){
                $.ajax({
                    type:'POST',
                    url:'colList/',
                    data:{'pid':editlist.idlist,'col':uid,'table':editlist.table},
                    success:function(txt){
                        if(txt=='ok'){
                            alertMsg({msg:'添加常用成功！！',mEn:'Add frequently successful!!'});
                        }
                    },
                    error:function(){

                    }
                })
            }
        };
        //管理员元素
        function adminHtml(t,ele,fn){
            $.ajax({
                type:'GET',
                url:'getHtml/',
                data:{'type':t,'user_author':user_author},
                success:function(text){
                    ele.append(text).removeClass('hide');
                    if(fn){
                        fn()
                    }
                }
            });
        }
    }
    function  obj(){}
    //弹出消息框
    $("#project-modal").on('shown.bs.modal', function (e) {
        // 关键代码，如没将modal设置为 block，则$modala_dialog.height() 为零
        $(this).css('display', 'block');
        var modalHeight=$(window).height() / 2 - $('#project-modal .modal-dialog').height() / 2;
        $(this).children('.modal-dialog').css({
            'margin-top': modalHeight
        }).unbind();
    });
    function alertClass(obts,fn){
        var set = $.extend({title:'提示',msg:'提交成功!!',type:'sm'},obts||{});
        $('#alertMsg').removeClass('bs-example-modal-sm');
        $('#alertMsg').removeClass('bs-example-modal-lg');
        $('#alertMsg').children().removeClass('modal-sm');
        $('#alertMsg').children().removeClass('modal-lg');
        $('#alertMsg').addClass('bs-example-modal-'+set.type);
        $('#alertMsg').children().addClass('modal-'+set.type);
        $("#alertTitle").html(set.title);
        $("#Msg").html(set.msg);
        if(fn){
            fn()
        }
    }
    function alertMsg(obts,fn){
            var set = $.extend({title:'提示',tEn:'Prompt',msg:'提交成功!!',mEn:'Submit successfully!!',type:'sm'},obts||{});
            $('#alertMsg').addClass('bs-example-modal-'+set.type);
            $('#alertMsg').children().addClass('modal-'+set.type);
            $("#alertTitle").html('<span class="Chinese">'+set.title+'</span><span class="English">'+set.tEn+'</span>');
            $("#Msg").html('<span class="Chinese">'+set.msg+'</span><span class="English">'+set.mEn+'</span>');
            $('#alertMsg').modal('show');
            $('#alertMsg').on('shown.bs.modal', function (e) {
                // 关键代码，如没将modal设置为 block，则$modala_dialog.height() 为零
                $(this).css('display', 'block');
                var modalHeight=$(window).height() / 2 - $('#alertMsg .modal-dialog').height() / 2;
                $(this).children('.modal-dialog').css({
                    'margin-top': modalHeight
                }).unbind();
            });
            $('#alertMsg').on('hidden.bs.modal.bs.modal', function (e) {
                $('#alertMsg').removeClass('bs-example-modal-'+set.type);
                $('#alertMsg').children().removeClass('modal-'+set.type);
            });
            $("#alertMsg .btn-success").unbind();
            $("#alertMsg .btn-success").click(function(){
                if(fn){
                    var s=fn();
                    if(s==false){
                        return;
                    }
                }
                $('#alertMsg').modal('hide');
                $(".modal-backdrop").remove();
                $(this).unbind();
            });
        }
    //验证正则
    var testREX={
        name:/[\\\/\?\:\*\<\>\|\"]|[\u4E00-\u9FA5]/,//遥控器等等的名字格式
        remote:/^[0-9A-Fa-f]*$/,//遥控器码值的格式
        pwd:/^[a-zA-Z][a-zA-Z0-9_]{5,12}$///密码的格式
    };
    //遥控码值验证函数
    function IRM(th,txt,Etxt){
        var reMsg = {statu:true,Msg:'',mEn:''};
        var tvk = {}; 
        th.each(function(){
            if($(this).attr('name')!='remote_name'){
                var v = $(this).val().toUpperCase();
                var fa = $(this).parent().parent().parent().attr('class')
                var tt = $(this).prev().text();
                if(v==''){
                    return false;
                }else if(testREX.remote.test(v)==false){
                    reMsg.statu = false;
                    reMsg.Msg = txt+tt+'只能由数字或字母a-f A-F组成！！';
                    reMsg.mEn = Etxt+tt+'Can only consist of numbers or letters a-f, A-F!!';
                    return false;
                }else if(v=='FF'){
                    reMsg.statu = false;
                    reMsg.Msg = txt+tt+'不能为ff或FF！！';
                    reMsg.mEn = Etxt+tt+'cannot be ff or FF!!';
                    return false;
                }else if(tvk[v]&&v!=''){
                    reMsg.statu = false;
                    reMsg.Msg = txt+tvk[v]+'与'+tt+'重复！！';
                    reMsg.mEn = Etxt+tvk[v]+' repeats with '+tt+'!!';
                    return false;
                }else{
                    tvk[v]=tt;
                }
            }                   
        });
        return reMsg;
    }
    //页面左侧菜单
    $.getJSON("static/js/main.json", function (data) {
        function upMenu(data){
            var html = '';
            $.each(data, function (p) {
                if (p == 0) {
                    html += "<li class='active' url='" + data[p].url + "'><b></b><p><span class='Chinese'>"+data[p].name1+"</span><span class='English'>" + data[p].En + "</span></p></li>";
                } else {
                    html += "<li url='" + data[p].url + "'><b></b><p><span class='Chinese'>"+data[p].name1+"</span><span class='English'>" + data[p].En + "</span></p></li>";
                }
            });
            $("#menu").html(html);
            var jumpMeun={
                init:function(){
                    this.bind();
                },
                bind:function() {
                    $(".content").css('margin-left','0px');
                    $(".content:not(.active) .content-title").css('margin-left','0px');
                    $("#menu>li>p").click(function () {
                        dropleft(1);
                    });
                    $(".content").click(function (e) {
                        if (e.target.id == 'drop' || e.target.id == 'dropspan') {
                            return;
                        }
                        dropleft(1);
                    });
                },
                unbind:function(){
                    $("#menu>li>p").unbind('click');
                    $(".content").unbind('click');
                    $(".content").css('margin-left','200px');
                    $(".content:not(.active) .content-title").css('margin-left','200px');
                }
            };
            jumpMeun.init();
            //加子页面
            $("#menu li").click(function () {
                $(this).addClass('active').siblings('li').removeClass('active').children('b').removeAttr('style');;
                $(this).children('b').css('margin-left', '0px');
                var url = $(this).attr('url');
                $('.content').attr('id',url.replace('#', '')).html('');
                project(url.replace('#', 'static/data/data/') + '.html', url);
            });
            $("div.pushpin a").click(function(){
                $(this).toggleClass('active');
                if($(this).attr('class').indexOf('active')>=0){
                    jumpMeun.unbind();
                }else{
                    jumpMeun.bind();
                }
            });
        }
        upMenu(data.umenu);
        /*$(".goAdmin .btn-link").click(function(){
            if($(this)==$(".goAdmin .btn-link.active")){
                return;
            }
            $(this).addClass('active').siblings('button').removeClass('active');
            var da=null;
            if($(this).attr('id')=='umenu'){
                da=data.umenu;
            }else{
                da=data.amenu;
            }
            upMenu(da);
            $("#menu li").removeClass('active');
            $("#menu li[url='#"+$('.content').attr('id')+"']").addClass('active').children('b').css('margin-left', '-5px');
        });*/
        ///
    });

    /**********??夭说??????说??暮??************/
    //页面左侧菜单滑出和收起
    function dropleft(n) {
        if (n == 1) {
            $(".leftmenu").css("left", "-200px");
            $("div.leftmenu ul > li.active b").removeAttr('style');
        } else if (n == 0) {
            $(".leftmenu").css("left", "0");
            $("div.leftmenu ul > li.active b").css('margin-left', '0px');
        }
    }
    //用户操作，修改密码，头像等等
    var userModal = {
        url: null,
        ele: null,
        el: '',
        init: function (options) {
            var settings = $.extend({ele: null, el: null}, options);
            this.ele = settings.ele;
            this.el = settings.el;
            this.el.click(function () {
                userModal.url = 'static/data/data/' + $(this).attr('jump') + '.html';
                userModal.eleShow();
            });
            this.ele.prev('span.close-use').click(function () {
                userModal.eleHide();
            });
        },
        eleShow: function () {
            this.ele.parent().show();
            this.ele.load(userModal.url, function () {
                userModal.call();
            });
            $('div.zhezhao').show();
        },
        eleHide: function () {
            this.ele.html('').parent().hide();
            $('div.zhezhao').hide();
        },
        call: function () {
            var url = this.url.slice(17, this.url.length - 5);
            switch (url) {
                case 'rPwd':
                    this.rPwd();
                    break;
                case 'rPic':
                    this.rPic();
                    break;
                case 'rBgpic':
                    this.rBgpic();
                    break;
                case 'user':
                    this.user();
                    break;
                case 'exit':
                    this.exit();
                    break;
            }
        },
        rPwd: function () {
            $("#user-modal input").focus(function(){
                var id = $(this).attr('id');
                var th = $(this);
                userModal.rPwdMsg(id,th,'hint')
            });
            $("#user-modal input").keyup(function(){
                var id = $(this).attr('id');
                var th = $(this);
                var stat = '';
                switch ($(this).attr('id')){
                    case "upwd":
                        stat = hex_sha1(th.val())==login.uPwd?'succ':'err2';
                        break;
                    case "newPwd":
                        stat = testREX.pwd.test(th.val())?'succ':'err2';
                        break;
                    case "user_pwd":
                        stat = th.val()==$('#newPwd').val()?'succ':'err2';
                        break;
                }
                if(th.val()==''){
                    stat = 'err1';
                }
                userModal.rPwdMsg(id,th,stat);
            });
            $("#u-load .btn-success").click(function(){
                if($("#user-modal input").val()==''){
                    return;
                }
                var ss = true;
                $("#user-modal input").parent().next()
                    .children().children().children('span:nth-child(2)').each(function(){
                    if($(this).text()!=''){
                        ss = false;
                        return false;
                    }
                });
                if(ss){
                    var upwd = $("#user_pwd").val();
                    $.ajax({
                        type:'POST',
                        url:'RuPwd/',
                        data:{user_pwd:hex_sha1(upwd),user_id:uid},
                        success:function(txt){
                            if(txt=='ok'){
                                alertMsg({title:'提示',msg:'修改密码成功!!请重新登录',mEn:'Change password successfully! Please login again'},function(){
                                    window.open('login.html','_self');
                                });
                            }
                        }
                    });
                }
            });
        },
        rPwdMsg: function(id,th,stat){
            var html = '';
            var msg={
                'upwd':{'hint':'请输入原密码','err1':'原密码不能为空','err2':'密码错误','succ':''},
                'newPwd':{'hint':'请输6-12位字母和数字','err1':'新密码不能为空','err2':'密码格式错误','succ':''},
                'user_pwd':{'hint':'请确认密码','err1':'确认密码不能为空','err2':'两次密码不一样','succ':''}
            };
            var Engmsg={
                'upwd':{'hint':'Please input a password','err1':'Can not be empty','err2':'Password error','succ':''},
                'newPwd':{'hint':'Please lose 6-12 digits and letters','err1':'Can not be empty','err2':'Bad password format','succ':''},
                'user_pwd':{'hint':'Please confirm the password','err1':'Can not be empty','err2':'The password is different','succ':''}
            };
            var state={
                'hint':{'color':'warning','ionc':'glyphicon-exclamation-sign'},
                'err1':{'color':'danger','ionc':'glyphicon-remove'},
                'err2':{'color':'danger','ionc':'glyphicon-remove'},
                'succ':{'color':'success','ionc':'glyphicon-ok'}
            };
            html = '<div class="bg-'+state[stat]['color']+'">\
                        <span class="text-'+state[stat]['color']+'">\
                            <span class="glyphicon '+state[stat]['ionc']+'"></span>\
                            <span><pre class="Chinese">'+msg[id][stat]+'</pre><pre class="English">'+Engmsg[id][stat]+'</pre></span>\
                        </span>\
                    </div>';
            th.parent().next().html(html);
            th.parent().next().show();
        },
        rPic: function () {
            $("div.user_icon img").attr('src',uicon);
            $("#usePic").uploadPreview({
                Msg: 'usepMsg',
                Img: "upMsg",
                Width: 100,
                Height: 100,
                imgSize:100,
                ImgType: ["gif", "jpeg", "jpg", "bmp", "png"],
                Callback: function (url) {
                    $('.circle img,.bigFace img').attr('src', url);
                }
            });
            $.getJSON("static/js/face.json", function (data) {
                var html = '';
                $.each(data, function (i) {
                    html += "<img src='static/" + data[i].img + "'/>";
                });
                $(".sutraFace").html(html);
                $(".sutraFace").click('img', function (e) {
                    var img = $(e.target).attr('src');
                    $('.circle img,.bigFace img').attr('src', img);
                })
            });
            $(".rpic-t button").click(function () {
                if ($(this).attr('class') === 'btn') {
                    return;
                }
                $(this).removeClass('btn-default').siblings('button').addClass('btn-default');
                $("." + $(this).attr('face')).show().siblings('div').hide();
            });
            $("#u-load .btn-success").click(function(){
                var img = $("div.user_icon img").attr('src');
                var form= {'user_id':uid};
                var file = null;
                if(img&&img.indexOf('blob')<0){
                    form['user_icon']=img;
                }else {
                    file = $('#usePic');
                }
                formdata({
                    type:'POST',
                    url:'RIcon/',
                    data:form,
                    file:file,
                    fn:function(txt){
                        if(txt=='ok'){
                            alertMsg({title:'提示',msg:'修改头像成功!!',mEn:'Modify avatar success!!'},function(){
                                window.location.reload();
                            });
                        }
                    }
                });
            });
        },
        rBgpic: function () {

        },
        user: function () {
            $.ajax({
                type:'POST',
                url:'getUser/',
                data:{user_id:uid},
                success:function(data){
                    $.each(data[0],function(i){
                        $("#"+i).text(data[0][i]);
                    });
                }
            });
            $("#u-load .btn-success").click(function(){
                userModal.eleHide();
            });
        },
        exit: function () {
            $("#u-load .btn-success").click(function(){
                sessionStorage.clear();
                window.open('login.html','_self');
            });
            $("#u-load .btn-danger").click(function(){
                userModal.eleHide();
            });
        }
    };
    userModal.init({ele: $('#u-load'), el: $("div.user ul li a")});
    $(".zhezhao").click(function(){
        alertMsg({msg:'真的要退出吗？',mEn:'Are you sure?'},function(){
            $("#list").hide().html('');
            $('#u-load').html('');
            $("#user-modal").hide();
            $('.zhezhao').hide();
        });
    });
    /*var ShowKey={
        pid:null,
        html:null,
        init:function(id){
            if(id!='pro'){
                return;
            }
            this.showTo();
        },
        getMySQL:function(th){
            $.ajax({
                type:'GET',
                url:'GetProkeypad/',
                data:{'pid':ShowKey.pid},
                success:function(data){
                    var html='<div class="KeyPadShow" id="showKeyPad">\
                                <ul>\
                                    <li>k0:'+data[0]["keypad_name__keypad_k0"]+'</li>\
                                    <li>k1:'+data[0]["keypad_name__keypad_k1"]+'</li>\
                                    <li>k2:'+data[0]["keypad_name__keypad_k2"]+'</li>\
                                    <li>k3:'+data[0]["keypad_name__keypad_k3"]+'</li>\
                                    <li>k4:'+data[0]["keypad_name__keypad_k4"]+'</li>\
                                    <li>k5:'+data[0]["keypad_name__keypad_k5"]+'</li>\
                                    <li>k6:'+data[0]["keypad_name__keypad_k6"]+'</li>\
                                    <li></li>\
                                </ul>\
                            </div>';
                    th.append(html);
                }
            });
        },
        showTo:function(){
            $("#index tbody td:nth-child(6)").hover(
                function (){
                    ShowKey.pid = $(this).parent().children('td:nth-child(1)').text();
                    th = $(this);
                    ShowKey.getMySQL(th);
                },
                function (){
                    $(this).children('div').hide().remove();
                }
            );
        }
    };*/
    //切换语言
    $('#select-language').click(function(){
        var val = $('body').attr('class');
        if(val=='CH'){
            val = 'English';
        }else{
            val = '中文简体';
        }
        $.ajax({
            type:'POST',
            url:'selectLg/',
            data:{val:val,uid:uid},
            success:function(text){
                if (text == 'ok'){
                    window.location.reload();
                }
            }
        });
    });
    //帮助文档
    var HelpUse={
        init:function(){
            $("#help-button").click(function(){
                HelpUse.toggleimg();
            });
            this.button();
        },
        toggleimg:function(){
            if($("#help-button img").attr('statu')=='open'){
                $("#help-button img").attr('src','static/Images/close.png').attr('statu','close');
                this.ShowHelpTxt();
            }else{
                $("#help-button img").attr('src','static/Images/help.png').attr('statu','open');
                this.HideHelpTxt();
                $(".modal-backdrop").remove();
            }
        },
        ShowHelpTxt:function(){
            $("#helpModel .modal-body").load('static/data/data/help.html',function(){
                HelpUse.setting();
                HelpUse.scro();
            });
            $("#helpModel").modal('show');
        },
        HideHelpTxt:function(){
            $("#helpModel").modal('hide');
        },
        button:function(){
            $("#helpModel").on("hide.bs.modal",function(){
                $("#help-button img").attr('src','static/Images/help.png').attr('statu','open');
            });
        },
        setting:function(){
            $("#helpMune li:not(#munebg)").click(function(){
                th = $(this);
                var p = 1;
                for(var i=2;i<=6;i++){
                    if($("#helpMune li:nth-child("+i+")").text()==th.text()){
                        p=i-2;
                    }
                }
                var r=$("#helpTxt div:nth-child("+(p+1)+")").offset().top-parseInt($('div#helpTxt').offset().top)-10+parseInt($("div#helpTxt").scrollTop());
                $("div#helpTxt").animate({scrollTop:r},200);
                //HelpUse.goto(th,p);
            });
        },
        goto:function(th,i){
            th.addClass('active').siblings('li').removeClass('active');
            $("#munebg").css('top',i*28+'px');
        },
        scro:function(){
            $("div#helpTxt").scroll(function(){
                var th = null;
                var i = null;
                $('div#helpTxt h4').each(function(){
                    var r=parseInt($(this).offset().top)-parseInt($('div#helpTxt').offset().top)-10;
                    i =$(this).parent().index()+1;
                    if(r>100){
                        return false;
                    }
                });
                th=$("#helpMune li:nth-child("+i+")");
                HelpUse.goto(th,i-2);
            });
        }
    };
    HelpUse.init();
    //下载项目文件
    function downloadFile(url) {
        try{
            var elemIF = document.createElement("iframe");
            elemIF.src = url;
            elemIF.style.display = "none";
            document.body.appendChild(elemIF);
        }catch(e){

        }
    }
    //复制代码
    $("#copy-config").zclip({
        path: "static/js/ZeroClipboard.swf",
        copy: function(){
            return $("#config").val();
        },
        afterCopy:function(){/* 复制成功后的操作 */
            var $copysuc = $("<div class='copy-tips'><div class='copy-tips-wrap'>☺ 复制成功</div></div>");
            $("body").find(".copy-tips").remove().end().append($copysuc);
            $(".copy-tips").fadeOut(3000);
        }
    });
    //兼容的表单异步提交
    function formdata(obt){
        var s = $.extend({data: null,file:null, fn: null,type:null,url:null}, obt);
        if(s.file){
            s.file.upload({
                url: s.url,
                dataType:'text',
                params: s.data,
                onSend: function (obj, str) { return true;},
                onComplate: function (e) {
                    if(s.fn){
                        s.fn(e);
                    }
                },
                onProgress: function (e) {}
            });
            s.file.upload('ajaxSubmit');
        }else{
            $.ajax({
                url: s.url,
                type: s.type,
                data: s.data,
                success:function(data){
                    if(s.fn){
                        s.fn(data);
                    }
                }
            });
        }
    }
    $('body').on('click','#five',function(){
        if($(this).is(':checked')){
            $('div.in').html('').next('input').val('');
            $('#keydown span').removeAttr('style').show();
            $('[kp=7]').hide();
            $('span[kp=5]').show();
        }else{
            $('div.in').html('').next('input').val('');
            $('#keydown span').removeAttr('style').show();
            $('[kp=7]').show();
            $('span[kp=5]').hide();
        }
        $(document).off('mousemove.drag');
    })
});
