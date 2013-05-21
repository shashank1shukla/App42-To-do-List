

 
/*  
  *  signup for new user.
 */
function createUser(){
    $("#createUserLoader").show();
    var error = "false"
    $(".success").hide();
    $(".error").hide();
    var userName = $("#userName").val();
    var pwd = $("#userPwd").val();
    var email = $("#userEmail").val();
    var user  = new App42User();
    if(userName == "" || userName == null ){
        error = "true"
        $.mobile.showPageLoadingMsg("a","Please enter UserName !...", "a");
        setTimeout(function (){
            $.mobile.hidePageLoadingMsg();
        },2000)
        $("#createUserLoader").hide();
       
    }
    else if(pwd == "" || pwd  == null){
        error = "true"
        $.mobile.showPageLoadingMsg("a","Please enter PassWord !...", "b");
        setTimeout(function (){
            $.mobile.hidePageLoadingMsg();
        },2000)
        $("#createUserLoader").hide();
    }
    else if(email == "" || email  == null){
        error = "true"
        $.mobile.showPageLoadingMsg("a","Please enter Email Address !...", "b");
        setTimeout(function (){
            $.mobile.hidePageLoadingMsg();
        },2000)
        $("#createUserLoader").hide();
    }
        
    else if(error == "true"){
        ReloadPage();
    }
    else{
        try{
            user.createUser(userName, pwd, email,{
                success: function(object) {
                    $(".success").show();
                    var userObj = JSON.parse(object)
                    var name = userObj.app42.response.users.user.userName;
                    var email = userObj.app42.response.users.user.email;
                    $("#newUserName").html(name);
                    $("#newUserEmail").html(email);
                    window.location = ('#success');
                    $("#createUserLoader").hide();
                },
                error: function(error) {
                    $(".error").show();
                    var errorObj = JSON.parse(error)
                    var errorCode = errorObj.app42Fault.appErrorCode
                
                    if(errorCode == 2001){
                        $("#unAuthorized1").message({
                            type:"error", 
                            message:"User Name '"+userName+"' Already Exist / Please Try Again With Different Name."
                        });
                        $("#createUserLoader").hide();
                    }
                    else if(errorCode == 2005){
                        $("#unAuthorized1").message({
                            type:"error", 
                            message:"Email Id '"+email+"' Already Exist / Please Try Again With Different Email Id."
                        });
                        $("#createUserLoader").hide();
                    }
                    else{
                        ReloadPage();
                    }
                }
            }); 
        }catch(App42Exception){
            $(".error").show();
            $('#error').html(App42Exception.message);
        }
    }
}

// Authenticate User using App42.
function login(){
    $("#logInLoader").show();
    var userName = $("#uName").val();
    var pwd = $("#pwd").val();
    var user  = new App42User();
    if(userName == "" || userName == null){
        
        $("#userNameBlank").message({
            type:"error", 
            message:"Please enter UserName !"
        });
        setTimeout(function (){
            $("#userNameBlank").message("hide");
        },2000)
        $("#logInLoader").hide();
         
    	
    }else if(pwd == "" || pwd == null){
        
        $("#passwordBlank").message({
            type:"error", 
            message:"Please enter Password !"
        });
        setTimeout(function (){
            $("#passwordBlank").message("hide");
        },2000)
        $("#logInLoader").hide();
        
    }else {
    
        try{
            user.authenticate(userName, pwd,{
                success: function(object) {
                    var userObj = JSON.parse(object)
                    var name = userObj.app42.response.users.user.userName;
                    var sId =  userObj.app42.response.users.user.sessionId;
                    $.session.set('login', name);
                    $.session.set('sessionId', sId);
                    getEmail(userName);
                    
                },
                error: function(error) {
                    $(".error").show();
                    var errorObj = JSON.parse(error).app42Fault.details;
                    $("#invalidUser").message({
                        type:"error", 
                        message:errorObj
                    });
                    setTimeout(function (){
                        $("#invalidUser").message("hide");
                    },5000)
                    $("#logInLoader").hide();
                    
                }
                    
            }
            ); 
        }
        catch(App42Exception){
            $(".error").show();
            $('#error').html(App42Exception.message);
        }
    }
}



           
           
function logOut(){
    $("#logInLoader").show();
    $.session.clear();
    window.location = ('#login');
    ReloadPage();
    $("#logInLoader").hide();
}    



function ReloadPage() {
    location.reload();
}


function friends(){
    var user  = new App42User();
    user.getAllUsers({
        success: function(object) {
            var userObj = JSON.parse(object)
            result = userObj.app42.response.success;
            var frnds = userObj.app42.response.users.user
            for (var i = 0; i < frnds.length; i++){
                var newUser = frnds[i].userName;
                 	
                $("#frnds_list").append('<li id="anchor" data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="false" data-iconpos="right" data-theme="f" class="ui-btn ui-btn-icon-right ui-li ui-li-has-alt ui-btn-up-f"><div class="ui-btn-inner ui-li ui-li-has-alt"><div class="ui-btn-text"><a class="ui-link-inherit" data-rel="dialog" data-transition="flow" href="#" onclick = "" ><span style="white-space:normal;">'+newUser+'</span></a></div></div><a id="invite" data-transition="flow" data-rel="dialog" href="#shareTodoWithFriend" onclick = "getFriendName('+"'"+newUser+"'"+');" title="Organise Event With This Friend" class="ui-li-link-alt ui-btn ui-btn-up-a" data-corners="false" data-shadow="false" data-iconshadow="false" data-wrapperels="span" data-icon="false" data-iconpos="false" data-theme="a"><span class="ui-btn-inner"><span class="ui-btn-text"></span><span data-corners="true" data-shadow="false" data-iconshadow="false" data-wrapperels="span" data-icon="gear" data-iconpos="notext" data-theme="a" title="" class="ui-btn ui-btn-up-a ui-shadow ui-btn-corner-all ui-btn-icon-notext"><span class="ui-btn-inner ui-btn-corner-all"><span class="ui-btn-text"></span><span class="ui-icon ui-icon-gear ui-icon-shadow">&nbsp;</span></span></span></span></a></li>');
            }
        },
        error: function(error) {
            $("#todoListLoader").hide();
            $.mobile.showPageLoadingMsg("a","Your Todo List Is Empty", "e");
        }
    }); 
}

function getFriendName(frndName){
    var user  = new App42User();
    user.getUser(frndName,{
        success: function(object) {
            var userObj = JSON.parse(object)
            result = userObj.app42.response.success;
            var frnds = userObj.app42.response.users.user.userName
            $.session.set('frendz',frnds)
            
        },
        error: function(error) {
        }
    })
}

function getEmail(userName){
    var user = new App42User();
    user.getUser(userName,{
        success: function(object) {
            var userObj = JSON.parse(object)
            result = userObj.app42.response.success;
            var userEmail = userObj.app42.response.users.user.email
            $.session.set('uEmail',userEmail)
            window.location = ('#welcome');
            ReloadPage();
            $("#logInLoader").hide();
        },
        error: function(error) {
        }
    })
}
