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

    document.getElementById('search-within-time').addEventListener('click', function(){
      searchWithinTime();
    });

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


  /*This function allows the user write the address he is and based on select( time and mode(car, walk etc)),
  he will know the nearest places for him to go
  */
  function searchWithinTime(){
    //initialize the distance matrix service
    var distanceMatrixService = new google.maps.DistanceMatrixService;
    var address = document.getElementById('search-within-time-text').value;
    // if it's blank, window appear if not then ...
    if (address == ''){
      window.alert('You must enter and address');
    } else {
      hideListings();
      // Use the distance matrix service to calculate the duration of the
      // routes between all our markers, and the destination address entered
      // by the user. Then put all the origins into an origin matrix.
      var origins = [];
      for (var i = 0; i < markers.length; i++) {
        origins[i] = markers[i].position;
      }
      var destination = address;
      var mode = document.getElementById('mode').value;
      // Now that both the origins and destination are defined, get all the
      // info for the distances between them.
      distanceMatrixService.getDistanceMatrix({
        origins: origins,
        destinations: [destination],
        travelMode: google.maps.TravelMode[mode],
        unitSystem: google.maps.UnitSystem.METRIC,
      }, function(response, status) {
        if (status !== google.maps.DistanceMatrixStatus.OK){
          window.alert('Error was:' + status);
        } else {
          displayMarkersWithinTime(response);
        }
      });
    }
  }

  /*if it's ok, then this function will display the criterias information by the user
   This function will go through each of the results, and,if the distance is
   LESS than the value in the picker, show it on the map.*/
  function displayMarkersWithinTime(response) {
    var maxDuration = document.getElementById('max-duration').value;
    var origins = response.originAddresses;
    var destinations = response.destinationAddresses;
    // Parse through the results, and get the distance and duration of each.
    // Because there might be  multiple origins and destinations we have a nested loop
    // Then, make sure at least 1 result was found.
    var atLeastOne = false;
    for (var i = 0; i < origins.length; i++) {
      var results = response.rows[i].elements;
      for (var j = 0; j < results.length; j++) {
        var element = results[j];
        if (element.status === "OK") {
          // The distance is returned in feet, but the TEXT is in miles. If we wanted to switch
          // the function to show markers within a user-entered DISTANCE, we would need the
          // value for distance, but for now we only need the text.
          var distanceText = element.distance.text;
          // durantion value is given in seconds, so we make it in MINUTES
          var duration = element.duration.value / 60;
          var durationText = element.duration.text;
          if (duration <= maxDuration) {
            markers[i].setMap(map);
            atLeastOne = true;
            // create mini window with info to open immediately and contain them
            // distance and duration
            var infowindow = new google.maps.InfoWindow({
              content: ' You are ' + durationText + ' away. A total of  ' + distanceText +
                '<div><input type=\"button\" value=\"View Route\" onclick =' +
                '\"displayDirections(&quot;' + origins[i] + '&quot;);\"></input></div>'
            });
            infowindow.open(map, markers[i]);
            // Put this in so that this small window closes if the user clicks
            // the marker, when the big infowindow opens
            markers[i].infowindow = infowindow;
            google.maps.event.addListener(markers[i], 'click', function(){
              this.infowindow.close();
            });
          }
        }
      }
    }
    if (!atLeastOne) {
      window.alert('We could not find any locations within that distance!');
    }
  }

  // This function represent the button "show route" follw by displayMarkersWithinTime
  // where it calculates the distance. This will display the route
  // on the map.
  function displayDirections(origin) {
    hideListings();
    var directionsService = new google.maps.DirectionsService;
    // get the destination address  from the user entered value
    var destinationAddress =
    document.getElementById('search-within-time-text').value;
    //get mode again from the user entered value
    var mode = document.getElementById('mode').value;
    directionsService.route({
      // the origin is the passed in marker's position.
      origin: origin,
      destination: destinationAddress,
      travelMode: google.maps.TravelMode[mode]
    }, function(response, status){
      if(status === google.maps.DirectionsStatus.OK){
        var directionsDisplay = new google.maps.DirectionsRenderer({
          map: map,
          directions: response,
          // draggable: a rota pode ser arrastada
          draggable: true,
          polylineOptions: {
            strokeColor: '#993366'
          }
        });
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
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
