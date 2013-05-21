 var map;
    var marker = null;
    function initialize() {
       var address =$("#searchMap").val();
        //alert(address)
       geocoder = new google.maps.Geocoder();

       var myLatlng = new google.maps.LatLng(64.396938,16.699219);
       var myOptions = {
           
           zoom: 12,
           //center: myLatlng,
           mapTypeId: google.maps.MapTypeId.ROADMAP
       }
       map = new google.maps.Map(document.getElementById("map_canvas1"), myOptions);

       var marker = new google.maps.Marker({
           position: myLatlng,
           map: map,
           draggable:true
       });
       var infowindow = new google.maps.InfoWindow({
           content: ""+myLatlng+""
       });

       geocoder.geocode( { 'address': address}, function(results, status) {
           if (status == google.maps.GeocoderStatus.OK) {
               map.setCenter(results[0].geometry.location);
               marker.setPosition(results[0].geometry.location);
               marker.setMap(map);
                addPoint(results[0].geometry.location);
                 $('#refreshIcon').show();
           } else {

        //    alert("error")
         }
       });
       google.maps.event.addListener(map, 'click', function(event) {

           point = event.latLng;
           infowindow.close();
           marker.setPosition(point);
           marker.setMap(map);
           addPoint(point);

       });

       google.maps.event.addListener(marker, 'mouseout', function() {
           point = marker.getPosition();
           var pointC = ""+point.toUrlValue(6)+"";
           marker.setPosition(point);
           infowindow.setContent(pointC);
           infowindow.open(map,marker);
           addPoint(point);
       });

       function addPoint(point) {
          // alert(point.lat());
        //   window.document.forms.mapF.elements.latitude.value = point.lat();
        //   window.document.forms.mapF.elements.longitude.value = point.lng();
       }
       // google.maps.event.addListener(marker, 'click', function() {
       //   map.setZoom(8);
       // });
    }


    function moveToDarwin() {
       var darwin = new google.maps.LatLng(64.396938,16.699219);
       map.setCenter(darwin);
     }
    function addPointOnClick(point) {
       //alert(point.lat());
       window.document.forms.mapF.elements.latitude.value = point.lat();
       window.document.forms.mapF.elements.longitude.value = point.lng();
    }
    //initialize();