var idVideo;
var whatVideo = [];
var howVideo = [];
var whyVideo = [];
var pos

function getJson(p) {  // richiesta alla API YTSearch
  $.ajax({
    type: "GET",
    dataType: "json",
    url: "https://www.googleapis.com/youtube/v3/search?part=snippet&q=" + p + "&type=video&key=AIzaSyAh6dqWLmaRoAVRpy0j8cIJyWe4ZVpGC-Y",
    success: function (data) {
      pos = p;
      var jsonList = data;
      var numResults = jsonList.pageInfo.totalResults;
      if (numResults > 0) {
        for (var i = 0; i < numResults; i++) {
          var split = jsonList.items[i].snippet.description.split(":");
          var purpose = split[1];
          switch (purpose) {
            case "how":
              howVideo.push(jsonList.items[i].id.videoId);
              break;
            case "why":
              whyVideo.push(jsonList.items[i].id.videoId);
              break;
            default:
              whatVideo.push(jsonList.items[i].id.videoId);
          }
        }
        play(); // fa partire effettivamente il video
      }
      
    }
  })
}


function play() {
  var index = 0;
  var $videoSrc;
  var list = whatVideo;  // di default i video visualizzati sono i WHAT
  $videoSrc = "https://www.youtube.com/embed/" + list[index];

  //autoplay del video all'apertura del modal
  $('#ModalVideoPlayer').on('shown.bs.modal', function (e) {
    $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");  // set the video src to autoplay and not to show related video.
  });

  // CAMBIA LA LISTA DA CUI IFRAME PRENDE I VIDEO 
  $("select.filterPurpose").change(function () {
    var selectedPurpose = $(this).children("option:selected").val();
    console.log("Filtra per: " + selectedPurpose);
    switch (selectedPurpose) {
      case "how":
        list = howVideo;
        index = 0;
        break;
      case "why":
        list = whyVideo;
        index = 0;
        break;
      default:
        list = whatVideo;
        index = 0;
    }

    $videoSrc = "https://www.youtube.com/embed/" + list[index]; //aggiorna il link con il primo video della lista filtrata
    $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
  });

  $('#prevClip').click(function () {
    if (index == 0) {
      alert("Questa è la prima clip !");
    } else {
      index--;
      $videoSrc = "https://www.youtube.com/embed/" + list[index];
      $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
    }
  });

  $('#nextClip').click(function () {
    console.log("Index: "+ index+"List dim: "+list.length);
    if(index+1  < list.length) {
      index++;
      $videoSrc = "https://www.youtube.com/embed/" + list[index];
      $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
    } else {
      alert("Questa è l'ultima clip !");
    }
  });

  $('#reachThePlace').click(function() {
    $('#ModalVideoPlayer').modal('hide');
    if (currentRoute) {  //per rimuovere rettangolo bianco delle indicazioni stradali, se c'è
      currentRoute.setWaypoints([]);
      $('.leaflet-routing-container.leaflet-bar.leaflet-control').remove();
    }
    //var posAttuale = OpenLocationCode.encode(position.lat, position.lng);
    routes = [position];
    var dec = OpenLocationCode.decode(pos);
    //LatLng(44.487981, 11.315192)
    var meta = new L.LatLng(dec.latitudeCenter, dec.longitudeCenter);
    routes.push(meta);
    currentRoute = L.Routing.control({
      waypoints: routes,
      createMarker: function() {
       return null;
      }
    }).addTo(map);
    activeRoute = true;
    document.getElementById("cancelRoute").style.visibility = "visible";
  });

  $('#ModalVideoPlayer').modal('show');
}

// chiusura modal
$('#ModalVideoPlayer').on('hidden.bs.modal', function () {  // svuota gli array di video quando il modal viene chiuso                 // altrimenti il contenuto degli array si duplica ogni volta che si clicca su play
  $("#video").attr('src', ""); //viene modificato il src del video, così da non riprodurne nessuno
  whatVideo = [];
  howVideo = [];
  whyVideo = [];
});


