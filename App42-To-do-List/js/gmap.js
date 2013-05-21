function refreshMap(){
        initialize();
        $('#search').show();
        $('#refreshIcon').hide();
           $('#msgContain').hide();
      }
      function hideButtn(){
 $('#refreshIcon').show();
        $('#search').hide();
        $('#msgContain').show();
      }
  $(document).ready(function () {
     var special_char = /[@!#\$\^%&*()+=\-\[\]\\\';\\/\{\}\|\":<>\?]/;
  $('#search').click(function () {
var desc = $.trim($("#description").val())


          var error = 'false';
          $("#dErr").hide();
           $("#lErr").hide();
            $("#laErr").hide();
            $("#loErr").hide();
          if ($.trim($("#searchMap").val()).length == 0) {
        $("#lErr").show();
              $("#lErr").html('Marker name is mandatory.');
              $("#lErr").addClass('error');
              error = "true";
          }
          
       if ($.trim($("#myMapLat").val()).length == 0) {
        $("#laErr").show();
              $("#laErr").html('Latitude is mandatory.');
              $("#laErr").addClass('error');
              error = "true";
          }
         
         if ($.trim($("#myMapLong").val()).length == 0) {
        $("#loErr").show();
              $("#loErr").html('Longitude is mandatory.');
              $("#loErr").addClass('error');
              error = "true";
          }
        

if (desc.length == 0 || desc == "Enter coordinates description ...") {
        $("#dErr").show();
              $("#dErr").html('Description is mandatory.');
              $("#dErr").addClass('error');
              error = "true";
          }else if (desc.match(special_char)) {
                $("#dErr").show();
               $("#dErr").html('Special chars are not allowed in description');
              $("#dErr").addClass('error');
              error = "true";
            } else if(desc.length > 49){

               $("#dErr").show();
              $("#dErr").html('Description should be less than or equal 50 chars');
                $("#dErr").addClass('error');
                error = "true";
            }
         

            if (error == "true")
            {
              return false;
            }
            else
            {
              $("#mapF").submit();
              return true;
            }

      });
  });