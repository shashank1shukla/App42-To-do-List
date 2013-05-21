

/* 
 * Insert To-do using json data to App42 Storage
 * 
 */
function insertJSONDocument(){
    $("#addTodoLoader").show();
    var todoName = $("#tName").val();
    var startDate = $("#sDate").val();
    var endDate = $("#eDate").val();
    var time = $("#time").val();
    var location = $("#location").val();
    var storage  = new App42Storage();
    var dbName = "todolist";
    var collectionName = "newtodo";
    var json = "{\"task\":'"+todoName+"',\"startDate\":'"+startDate+"',\"endDate\":'"+endDate+"',\"time\":'"+time+"',\"location\":'"+location+"'}";
    var sessionId = $.session.get('sessionId');
    
    storage.setSessionId(sessionId);
    if(todoName == "" ||todoName == null){
        $.mobile.showPageLoadingMsg("e","Please enter Todo Name", "a");   
        setTimeout(function (){
            $.mobile.hidePageLoadingMsg();
        },2000)
        
    }else{
        storage.insertJSONDocument(dbName, collectionName, json,{
            success: function(object) {
                var storageObj = JSON.parse(object)
                console.log(storageObj);
                var toList = storageObj.app42.response.storage.jsonDoc.task
                var todosId = storageObj.app42.response.storage.jsonDoc._id.$oid
                $("#todo_list").append('<li id = '+todosId+'><a href="#">'+toList+'</a></li>');
                removeAccessFromOtherUser(dbName,collectionName,todosId);
            
            },
            error: function(error) {
            }
        }); 
    }
}
			
/* 
 * Get All To-do from storage
 * Add to list
 */			
function findAllDocuments(){
    $("#todoListLoader").show();
    var storage  = new App42Storage();
    var dbName = "todolist";
    var collectionName = "newtodo";
    var sessionId = $.session.get('sessionId');
    storage.setSessionId(sessionId);
    storage.findAllDocuments(dbName, collectionName,{
        success: function(object) {
            var storageObj = JSON.parse(object)
             
            result = storageObj.app42.response.success;
            var todos = storageObj.app42.response.storage.jsonDoc
            for (var i = 0; i < todos.length; i++){
                var todo = todos[i].task;
                var todosId = todos[i]._id.$oid;
                 	
                $("#todo_list").append('<li id='+todosId+' data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="false" data-iconpos="right" data-theme="a" class="ui-btn ui-btn-icon-right ui-li ui-li-has-alt ui-btn-up-a"><div class="ui-btn-inner ui-li ui-li-has-alt"><div class="ui-btn-text"><a class="ui-link-inherit" href="#todoDetails?id='+todosId+'" onclick = "findDocumentById('+"'"+todosId+"'"+');" ><span style="white-space:normal;">'+todo+'</span></a></div></div><a id="remove" data-transition="slideup" data-rel="dialog" href="javascript:void(0);" onclick ="removeTodo('+"'"+todosId+"'"+')" title="Remove" class="ui-li-link-alt ui-btn ui-btn-up-a" data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="span" data-icon="false" data-iconpos="false" data-theme="a"><span class="ui-btn-inner"><span class="ui-btn-text"></span><span data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" data-icon="delete" data-iconpos="notext" data-theme="f" title="" class="ui-btn ui-btn-up-f ui-shadow ui-btn-corner-all ui-btn-icon-notext"><span class="ui-btn-inner ui-btn-corner-all"><span class="ui-btn-text"></span><span class="ui-icon ui-icon-delete ui-icon-shadow">&nbsp;</span></span></span></span></a></li>');
                $("#todoListLoader").hide();    
            }
        },
        error: function(error) {
            $("#todoListLoader").hide();
            $.mobile.showPageLoadingMsg("a","Your Todo List Is Empty", "e");
        }
    }); 
}
				

/* 
 * Remove To-do from list
 *
 */	
function removeTodo(docId){
    $("#todoListLoader").show();
    var storage  = new App42Storage();
    var dbName = "todolist";
    var collectionName = "newtodo";
    var sessionId = $.session.get('sessionId');
    storage.setSessionId(sessionId);
    storage.deleteDocumentById(dbName,collectionName,docId,{
        success: function(object) {
            $("#remove").closest("li").attr("id");
            $("#remove").closest("li").slideUp(function(){
                ReloadPage();
                $("#todoListLoader").hide();
                   
            })

        },
            
        error: function(error) {
            var errorobj = JSON.parse(error);
            var errorCode = errorobj.app42Fault.appErrorCode;
            
            if(errorCode == 2600){
                //   window.location = ("#todoDetails");   
                $("#unAuthorized2").message({
                    type:"error", 
                    message:"You Do Not Have Such Permissions To Remove This Event / Please Say To Owner Of This Event."
                });
                $("#todoListLoader").hide();
            }else{
                
        }
        }
    })
        
}
    			

/* 
 * find document to view in detail page.
 *
 */
function findDocumentById(tId){
    $("#detailsLoader").show();
    $.session.set('documentId', tId);
    var storage  = new App42Storage();
    var dbName = "todolist";
    var collectionName = "newtodo";
    var sessionId = $.session.get('sessionId');
    
    storage.setSessionId(sessionId);
    storage.findDocumentById(dbName, collectionName,tId,{
        success: function(object) {
            var obj = JSON.parse(object);
            var location = obj.app42.response.storage.jsonDoc.location
            if(location == "" || location == null){
                location = "Gurgaun";
                $.session.set('tLocation', location);
            }else{
                $.session.set('tLocation', location);
            }
            
            var task = obj.app42.response.storage.jsonDoc.task
            $.session.set('tName', task);
            
            var startDate = obj.app42.response.storage.jsonDoc.startDate
            $.session.set('tStartDate', startDate);
            
            var endDate = obj.app42.response.storage.jsonDoc.endDate
            $.session.set('tEndDate', endDate);
            
            var time = obj.app42.response.storage.jsonDoc.time
            $.session.set('tTime', time);
            
            var oName = obj.app42.response.storage.jsonDoc._$owner.owner
            $.session.set('ownerName', oName);
            initialize();
            ReloadPage();
            $("#detailsLoader").hide();
        },     
        error: function(error) {
              
        }
    }); 
                    
}

/* 
 * Remove Access From other User on To-do.
 *
 */
function removeAccessFromOtherUser(dbName,collectionName,docId){
    var storage  = new App42Storage();
    var sessionId = $.session.get('sessionId');
    storage.setSessionId(sessionId);
    var aclList = new Array();
    var point={
        user:"PUBLIC",
        permission:Permission.READ
    };
    aclList.push(point)
    storage.revokeAccessOnDoc(dbName, collectionName,docId, aclList,{
        success: function(object) {
            window.location = ('#todoList');
            ReloadPage();
            $("#addTodoLoader").hide();
        },
        error: function(error) {
        }
    }); 
}


function redirect(){
    window.location = ('#todoList');
    ReloadPage();
}


function back(){
    window.location = ('#todoDetails');
    ReloadPage();
}


function friendsPage(){
    window.location = ('#testing');
    ReloadPage();
}


function shareTodo(){
    var storage = new App42Storage();
    var friend = $("#fName").val();
    $.session.set('frndName',friend);
    var dbName = "todolist";
    var collectionName = "newtodo";
    var aclList = new Array();
    var point1={
        user:friend,
        permission:Permission.READ
    };
    aclList.push(point1)
    var tId = $.session.get('documentId');
    var tDocId = $.session.get('todoDocId');
    var getSession = $.session.get('sessionId');
    storage.setSessionId(getSession);
    storage.grantAccessOnDoc(dbName, collectionName,tId || tDocId, aclList,{
        success: function(object) {
            console.log(object)
            window.location = ("#successShare");
            ReloadPage();
        },
        error: function(error) {
            var errorobj = JSON.parse(error);
            var errorCode = errorobj.app42Fault.appErrorCode;
            
            if(errorCode == 2600){
                window.location = ("#todoDetails");   
                $("#unAuthorized").message({
                    type:"error", 
                    message:"You Do Not Have Such Permissions To Share This Event To AnyOne"
                });
            }else if(errorCode==1600){
                $.mobile.showPageLoadingMsg("e","Please enter Friend's Name", "a");   
                setTimeout(function (){
                    $.mobile.hidePageLoadingMsg();
                },2000)
                
            }else{
                
            }
            
            console.log(error)

        }
    });
}
                   

// share to-do
function shareTodoWithFriend(){
    var storage = new App42Storage();
    var todoName = $("#tNamef").val();
    var startDate = $("#sDatef").val();
    var endDate = $("#eDatef").val();
    var time = $("#timef").val();
    var location = $("#locationf").val();
    var dbName = "todolist";
    var collectionName = "newtodo";
    var json = "{\"task\":'"+todoName+"',\"startDate\":'"+startDate+"',\"endDate\":'"+endDate+"',\"time\":'"+time+"',\"location\":'"+location+"'}";
    var sessionId = $.session.get('sessionId');
    
    storage.setSessionId(sessionId);
    if(todoName == "" ||todoName == null){
        $.mobile.showPageLoadingMsg("e","Please enter Todo Name", "a");   
        setTimeout(function (){
            $.mobile.hidePageLoadingMsg();
        },2000)
        
    }else{
        storage.insertJSONDocument(dbName, collectionName, json,{
            success: function(object) {
                var storageObj = JSON.parse(object)
                console.log(storageObj);
                var toList = storageObj.app42.response.storage.jsonDoc.task
                var todosId = storageObj.app42.response.storage.jsonDoc._id.$oid
                $.session.set('todoDocId', todosId);
                $("#todo_list").append('<li id = '+todosId+'><a href="#">'+toList+'</a></li>');
                removeAccessForOtherFriends(dbName,collectionName,todosId);
                grantAccessForFriend(dbName, collectionName,todosId);
            },
            error: function(error) {
            }
        }); 
    }
}


function removeAccessForOtherFriends(dbName,collectionName,docId){
    var storage  = new App42Storage();
    var sessionId = $.session.get('sessionId');
    storage.setSessionId(sessionId);
    var aclList = new Array();
    var point={
        user:"PUBLIC",
        permission:Permission.READ
    };
    aclList.push(point)
    storage.revokeAccessOnDoc(dbName, collectionName,docId, aclList,{
        success: function(object) {
        },
        error: function(error) {
        }
    }); 
}

// share to-do with your friend
function grantAccessForFriend(dbName, collectionName,docId){
    var storage  = new App42Storage();
    var friend = $.session.get('frendz');
    var sessionId = $.session.get('sessionId');
    storage.setSessionId(sessionId);
    var aclList = new Array();
    var point1={
        user:friend,
        permission:Permission.READ
    };
    aclList.push(point1)
    storage.grantAccessOnDoc(dbName, collectionName,docId, aclList,{
        success: function(object) {
            window.location = ('#successShare2');
            ReloadPage();
        },
        error: function(error) {
        }
    }); 
}

