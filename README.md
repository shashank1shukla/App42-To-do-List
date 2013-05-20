App42-Todo-List
================

App42 Client SDK sample for HTML5.

Create upcoming event or task and make your to-do list and share with your friends using [App42CloudAPI] (http://api.shephertz.com/apis) javascript SDK.

__Feature List :__

1. User Authentication 
2. Session Storage
3. Hosting your own task or event in an usual location
4. Removable List Items
5. Share with your friends who has use this app
6. Support all mobile browsers and desktop browsers

# Runnnig Sample:

1. [Register] (https://apphq.shephertz.com/register) with App42 platform
2. Go to dashboard and click on the App Create .
3. Fill all the mandatory fields and and checked the ACL true to get your APIKey and SecretKey.

__Initialize App42 :__

Edit index.html file and put your APIKey and SecretKey overhear.

```
App42.initialize("Your APIKey","Your SecretKey");

```

#Design Details:

__App42 User:__

Initialize App42User 
```
var user  = new App42User();
```

Sign up for a new account.
 
```
var userName = ("#userName").val(),
password = ("#pwd").val(),
email = ("#email");
user.createUser(userName, password, email,{
success: function(object) {

},
error: function(error) {

}
});
```
Authenticate existing account.

```
var userName = ("#loginName").val(),
password = ("#loginPassword").val();
user.authenticate(userName, password,{
success: function(object) {
// get userName and sessionId from authenticat user response
var userObj = JSON.parse(object)
var name = userObj.app42.response.users.user.userName;
var sId =  userObj.app42.response.users.user.sessionId;
// save logged in user with sessionId to browser local storage.
$.session.set('login', name);
$.session.set('sessionId', sId);
},
error: function(error) {

}
});
```
Get all app users.

```
user.getAllUsers({
success: function(object) {

},
error: function(error) {

}
});
```
Get detail info of user.
```
var myProfile = ("#myProfile").val();
user.getUser(myProfile,{
success: function(object) {

},
error: function(error) {

}
});
```
__App42 Storage:__

Initialize App42Storage  
```
var storage  = new App42Storage(),
dbName = "Your db",
collectionName = "Your Collection";
// Get logged in user session id from authenticate response and set in to storage object.
var getSession = $.session.get('sessionId');
storage.setSessionId(getSession);
```

Save To-do using jsonData with storage 

```
var todoName = $("#tName").val(),
startDate = $("#sDate").val(),
endDate = $("#eDate").val(),
time = $("#time").val(),
location = $("#location").val(),
json = "{\"task\":'"+todoName+"',\"startDate\":'"+startDate+"',\"endDate\":'"+endDate+"',\"time\":'"+time+"',\"location\":'"+location+"'}";
storage.insertJSONDocument(dbName, collectionName, json,{
success: function(object) {
// Add To-do in to list 
// When to create any To-do this will accessible to every one
// To remove accessibility from other user call revokeAccessOnDoc method in storage object
},
error: function(error) {
// callback when error occurred.
}
}); 
```

Remove Access from other users to view your To-do

```
var docId = "get from insertJSONDocument response"
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
```

Get all To-do List created by you or shared with you

```
storage.findAllDocuments(dbName, collectionName,{
success: function(object) {
},
error: function(error) {

}
```

Remove your To-do

```
storage.deleteDocumentById(dbName,collectionName,docId,{
success: function(object) {
},
error: function(error) {
  
}
})
```
Get detail of To-do

```
storage.findDocumentById(dbName,collectionName,docId,{
success: function(object) {
},
error: function(error) {
 
}
})
```

Share your To-do with your selected user or type his/her name. 

```
var friendName = "your selected user from list"
var aclList = new Array();
var point1={
user:friendName,
permission:Permission.READ
};
aclList.push(point1)
// get documentId from local storage.
var tId = $.session.get('documentId');

storage.grantAccessOnDoc(dbName, collectionName,tId, aclList,{
success: function(object) {

},
error: function(error) {


}
});
```
