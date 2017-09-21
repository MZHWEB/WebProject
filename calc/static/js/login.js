/**
 * Created by Administrator on 2017/4/11.
 */
//获取cookie的值
var loginname = $.cookie('loginname');
var password = $.cookie('password');

//将获取的值填充入输入框中
$("input[name=userName]").val(loginname);
$("input[name=userPwd]").val(password);
if(loginname != null && loginname != '' && password != null && password != ''){//选中保存秘密的复选框
    $("#saveid").attr('checked',true);
}
$("#submit").click(function(){
    login();
});
function login(){
    var name=$("input[name=userName]").val();
    var pwd=$("input[name=userPwd]").val();
    if(name!=''&&pwd!=''){
        var uPwd=hex_sha1(pwd);
        var login={
            'uName':name,
            'uPwd':uPwd
        };
        $.ajax({
            type:'GET',
            url:'/login/',
            data: login,
            //contentType: 'application/json; charset=UTF-8',
            success: function(txt) {
                if (txt == 'err'){
                    alert('用户名或密码错误!!');
                }
                else{
                    sessionStorage.setItem('DX-uName',name);
                    sessionStorage.setItem('DX-uPwd',uPwd);
					if (!$("#saveid").is(':checked')) {
						$.cookie('loginname', '', {
							expires : -1
						});
						$.cookie('password', '', {
							expires : -1
						});
						$("input[name=userName]").val('');
						$("input[name=userPwd]").val('');
					}else{
						$.cookie('loginname', $("input[name=userName]").val(), {
							expires : 7
						});
						$.cookie('password', $("input[name=userPwd]").val(), {
							expires : 7
						});
					}
                    window.open("index.html",'_self');
                }
            },
            error:function(){
                alert('获取数据失败！！！');
            }
        });
    } else if(name==''||pwd==''){
        $('#loginMsg .alert').html("请输入用户名和密码！！");
        $('#loginMsg').modal('show');
    }else{
        $('#loginMsg').modal('show');
    }
}
$(window).keydown(function(e){
    if(e.keyCode==13){
        login();
    }
});
$("#login .text-primary").click(function(){
    var url = window.location.href;
    var title = $("title").html();
    try{
       window.external.addFavorite(url,title);
     }
    catch(e){
        try{
            window.sidebar.addPanel(title,url,"");
        }
        catch(e){
           alert("抱歉，您所使用的浏览器无法完成此操作。\n\n请使用快捷键Ctrl+D进行添加！");
        }
    }
});