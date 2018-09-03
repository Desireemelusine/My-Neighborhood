/*GOOGLEMAPS*/
var map;
// instead of one marker we create an Array due to the var locations
var markers = [];

function initMap() {
  var styles = [
        {
          featureType: 'water',
          //elementType: 'geometry.fill',
          stylers: [{color: '#78d0d1'}]
        },
        {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{color: '#ebdbbf'}]
      },
      {
          featureType: 'poi',
          elementType: 'geometry',
          stylers: [{color: '#5cc977'}]
        },
      {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [{color: '#cc8800'}]
      },
      {
        featureType: 'transit.station',
        elementType: 'labels.text.fill',
        stylers: [{color: '#d59563'}]
      }
  ];



  //Creates a new map - center and zoom are required
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 38.71765, lng: -9.1662076},
    zoom: 17,
    styles: styles,
    mapTypeControl: false
  });

  // creating an array of locations on the map
  var locations = [
    {title: 'Celeiro Supermarket', location: {lat: 38.718747, lng: -9.164838}},
    {title: 'Pingo Doce Supermarket', location: {lat: 38.718004, lng: -9.166404}},
    {title: 'Go Natural Supermarket', location: {lat: 38.718789, lng: -9.168128}},
    {title: 'Fruity & Fresh Supermarket', location: {lat: 38.720221, lng: -9.165792}},
    {title: 'Pingo Doce Supermarket', location: {lat: 38.716160, lng: -9.163915}}
  ];

  //creating info Window to show info about the marker place
  var largeInfowindow = new google.maps.InfoWindow();


  // marcadadore estilizados
  var defaultIcon = makeMarkerIcon('993366');
  var highlightedIcon = makeMarkerIcon('f7786b');




  //creating the bounds so all the markers fit on the page
  //var bounds = new google.maps.LatLngBounds(); now on function showListings
  //let's create our markers locations array
  for (var i = 0; i < locations.length; i++) {
    // getting the location and title
    var position = locations[i].location;
    var title = locations[i].title;
    // now we create a single marker for each position + title
    var marker = new google.maps.Marker({
      //map:map, now on function showListings
      position: position,
      title: title,
      icon: defaultIcon,
      animation: google.maps.Animation.DROP,
      id: i
    });
    //now we push the marker to our array of markers
    markers.push(marker);
    // extend bounds to each marker
    //bounds.extend(marker.position); now on function showListings
    // and we create the onclick event for the infowindow information
    marker.addListener('click', function() {
      populateInfoWindow(this, largeInfowindow);
    });
    //ICON change color add Listener
    marker.addListener('mouseover', function() {
      this.setIcon(highlightedIcon);
    });
    marker.addListener('mouseout', function() {
      this.setIcon(defaultIcon);
    });



    }
    // fit the map on the bounds
    //map.fitBounds(bounds); now on function showListings

    // Show and Hide Buttons
    document.getElementById('show-listings').addEventListener('click', showListings);
    document.getElementById('hide-listings').addEventListener('click', hideListings);

}

  function populateInfoWindow(marker, infowindow){
    //if infowindow from the marker is not open then: open, and create the content
    if (infowindow.marker != marker) {
      infowindow.marker = marker;
      infowindow.setContent('');
      infowindow.setContent('<div>' + marker.title + '</div>');
      infowindow.open(map, marker);
      //close infowindow when closeclick
      infowindow.addListener('closeclick', function(){
        infowindow.setMarker(null);
      });
      // adding street viewport
      var streetViewService = new google.maps.StreetViewService();
      //in case there is no image it will get the radius
      var radius= 50;
      //function to get the panorama
      function getStreetView(data, status) {
        if(status == google.maps.StreetViewStatus.OK) {
          var nearStreetViewLocation = data.location.latLng;
          var heading = google.maps.geometry.spherical.computeHeading(
            nearStreetViewLocation, marker.position);
            infowindow.setContent('<div' + marker.title + '</div><div id="pano"></div>');
            var panoramaOptions = {
              position: nearStreetViewLocation,
              pov: {
                heading: heading,
                pitch: 30,
              }
            };
          var panorama = new google.maps.StreetViewPanorama(
            document.getElementById('pano'), panoramaOptions);
        } else {
          infowindow.setContent('<div>' + marker.title + '</div>' + '<div> No street View Found</div>');
        }
      }
      // Use streetview service to get the closest streetview image within
      // 50 meters of the markers position
    streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
      // Open the infowindow on the correct marker.
    infowindow.open(map, marker);
    }
  }

  function showListings() {
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
      bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);
  }

  function hideListings() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
  }

  function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
      'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
      '|40|_|%E2%80%A2',
      new google.maps.Size(21, 34),
      new google.maps.Point(0, 0),
      new google.maps.Point(10, 34),
      new google.maps.Size(21,34));
    return markerImage;
  }



 /*var celeiro = {lat: 38.718747, lng:-9.164838};
 // creating the marker to show on the map the locations
 var marker = new google.maps.Marker({
   position: celeiro,
   map: map,
   title: "celeiro Supermarket"
 });

 //creating info Window to show info about the marker place
 var infowindow = new google.maps.InfoWindow({
   content:'An amazing supermarket for bio products'
 });

 // to open the info window we need to create an addListener
 //when the user clicks, it opens- IT NEEDS TO BE ASSOCIATED
 //WITH THE MARKER
 marker.addListener('click',function(){
   infowindow.open(map,marker);
 });*/
