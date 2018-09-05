/*---------------------MODEL------------------------------------------ */
var dataLocations = [
                  {
                    title: 'Celeiro Supermarket',
                    street: 'R. 4 de Infantaria 31B, 1350-166' ,
                    info: 'Click here for more info',
                    url: 'https://www.celeiro.pt/',
                    text: 'The perfect place for organic products, vegan, bio, etc.' ,
                    location: {lat: 38.718747, lng: -9.164838},
                  },
                  {
                    title: 'Pingo Doce',
                    street: 'R. Francisco Metrass 36, 1350-066',
                    info: 'Click here for more info',
                    url: 'https://www.pingodoce.pt/',
                    text: 'Basic supermaket, medium size.',
                    location: {lat: 38.718004, lng: -9.166404},
                   },
                   {
                    title: 'Go Natural Supermarket',
                    street: 'R. Azedo Gneco 30, 1350-036',
                    info: 'Click here for more info',
                    url: 'http://www.gonatural.pt/',
                    text: 'The perfect place for organic products, vegan, bio, etc.',
                    location: {lat: 38.718789, lng: -9.168128},
                  },
                  {
                    title: 'Fruity & Fresh Supermarket',
                    street: 'R. Tomás da Anunciação 145, 1350-092',
                    info: 'Click here for more info',
                    url: 'https://pt-pt.facebook.com/fruityfreshmarket/',
                    text: 'The right place for fruits and vegetables' ,
                    location: {lat: 38.720221, lng: -9.165792},
                   },
                   {
                     title: 'Pingo Doce Supermarket',
                     street: 'R. Ferreira Borges 14, 1350-096',
                     info: 'Click here for more info',
                     url: 'https://www.pingodoce.pt/',
                     text: 'Basic supermaket, medium-big size.',
                     location: {lat: 38.716160, lng: -9.163915},
                    }
                  ]


/*---------------------VIEWMODEL------------------------------------------ */
var ViewModel = function(){
  // coloquei o self para usar com o locationList
  var self = this;
  // create and observable so I can store the data inside
  this.locationList = ko.observableArray([]);
  //loop inside locationList and push the info out
  dataLocations.forEach(function(locationItem) {
    self.locationList.push(new Location(locationItem));
  });


  // Filters 'Top Places'.
  self.filter = ko.observable('');
  self.filteredPlaces = ko.computed(function() {
      var filter = self.filter().toLowerCase();
      if (!filter) {
          self.locationList().forEach(function(loc) {
              if (loc.marker) {
                  loc.marker.setVisible(true);
              }
          });
          return self.locationList();
      } else {
          return ko.utils.arrayFilter(self.locationList(), function(loc) {
              if (loc.title.toLowerCase().indexOf(filter) > -1) {
              //if (loc.title.indexOf(filter) > -1) {
                  loc.marker.setVisible(true);
                  return true;
              } else {
                  loc.marker.setVisible(false);
                  return false;
              }
          });
      }
  }, self);

  self.showInfo = function(location) {
    console.log("click");
      google.maps.event.trigger(location.marker, 'click');
  };





  /* create this.currentLocation,becomes the one who will carry the locationList,
  it's the pointer with index O just to give access.
  I need to create this because we have an array of data and it will bring the
  location the user clicks*/
  //this.currentLocation = ko.observable (this.locationList()[0]);

  /*According to knockoutJS, when the user clicks, it automatically execute a function
  It will pass through the object(THE location) and for that specific location we will given
  a random name. In this case getClickLocation, so it will get this location as current and show in the view*/
  /*this.markerLocation = function(getClickLocation){
    self.currentLocation(getClickLocation);
    var pointer = markers[getClickLocation];
    function() {
      var bounds = new google.maps.LatLngBounds();
        markers[pointer].setMap(map);
        bounds.extend(pointer.position);
        map.fitBounds(bounds);
      }
    }

    //var pointer = markers.marker(getClickLocation);
    console.log(getClickLocation);
  };*/

/*
  self.openInfoWindow = function(location) {
      google.maps.event.trigger(location.marker, 'click')
  };*/

  /* DO SOMETHING OR CONNECT WITH GOOGLEMAPS API SPECIFIC MARKER

  this.pointLocation = function(){
  self.currentLocation().location( show on the map)
}

  */

};

/*---------------------VIEW------------------------------------------ */
var Location = function(data){
  this.title = ko.observable(data.title);
  this.street = ko.observable(data.street);
  this.info = ko.observable(data.info);
  this.url = ko.observable(data.url);
  this.text = ko.observable(data.text);
  // should this be the place to connect WITH GOOGLE?????
  this.location = ko.observable(data.location);

  //list of locations
  this.locations = ko.observableArray(data.locations);


};




/*----------------------------GOOGLEMAPS: START------------------------*/
var map;
// instead of one marker we create an Array due to the var locations
var markers = [];

// Create placemakers array to use in multiple functions to have Control
//over the number os places that show ------  for SearchBox
var placeMarkers = [];

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

  //LAST STEP
  //Create the searchbox in order to execute a places search
  var searchBox = new google.maps.places.SearchBox(
    document.getElementById('places-search'));
  //Bias the searchBoxto wothin the bounds of the map
  searchBox.setBounds(map.getBounds());

  //creating info Window to show info about the marker place
  var largeInfowindow = new google.maps.InfoWindow();
  var bounds = new google.maps.LatLngBounds();


  // marcadadore estilizados
  var defaultIcon = makeMarkerIcon('993366');
  var highlightedIcon = makeMarkerIcon('f7786b');









  //creating the bounds so all the markers fit on the page
  //var bounds = new google.maps.LatLngBounds(); now on function showListings
  //let's create our markers locations array
  for (var i = 0; i < dataLocations.length; i++) {
    // getting the location and title
    var position = dataLocations[i].location;
    var title = dataLocations[i].title;
    // now we create a single marker for each position + title
    var marker = new google.maps.Marker({
      map:map, //now on function showListings
      position: position,
      title: title,
      icon: defaultIcon,
      animation: google.maps.Animation.DROP,
      id: i
    });

    // Attach the marker to the place object
    vm.locationList()[i].marker = marker;


    //now we push the marker to our array of markers
    markers.push(marker);
    // extend bounds to each marker
    bounds.extend(markers[i].position);  //now on function showListings
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
    map.fitBounds(bounds); //now on function showListings


    // Show and Hide Buttons
   //document.getElementById('show-listings').addEventListener('click', showListings);
   document.getElementById('hide-listings').addEventListener('click', function() {
   hideMarkers(markers);
 });

    document.getElementById('search-within-time').addEventListener('click', function(){
      searchWithinTime();
    });

    // Listen for the event fired when the user selects a prediction from the
    // picklist and retrieve more details for that place. ////SearchBox without prediction
    searchBox.addListener('places_changed', function() {
      searchBoxPlaces(this);
    });
    // Listen for the event fired when the user selects a prediction and clicks
    // "go" more details for that place. ////SearchBox Autocomplete prediction
    document.getElementById('go-places').addEventListener('click', textSearchPlaces);

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
        infowindow.marker = null;
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
/*
  function show(marker) {
    var bounds = new google.maps.LatLngBounds();
      markers[marker].setMap(map);
      bounds.extend(marker.position);
      map.fitBounds(bounds);
  }

  function showListings() {
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
      bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);
  }*/

  function hideMarkers(markers) {
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
      hideMarkers(markers);
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
    hideMarkers(markers);
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

  /* this function fires when the user selects a searchbox picklist item generated by Google.
  I will do a neraby search using the select query string or place*/
  function searchBoxPlaces(searchBox) {
    hideMarkers(placeMarkers);
    var places = searchBox.getPlaces();
    if (places.length == 0) {
      window.alert('We did not find any places matching that search!');
    } else {
    // For each place, get the icon, name and location.
      createMarkersForPlaces(places);
    }
  }

  // This function firest when the user select "go" on the places search.
  //The user will write the place
  // It will do a nearby search using the entered query string or place.
  function textSearchPlaces(){
    var bounds = map.getBounds();
    hideMarkers(placeMarkers);
    var placesService =new google.maps.places.PlacesService(map);
    placesService.textSearch({
      query: document.getElementById('places-search').value,
      bounds: bounds
    }, function(results, status){
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        createMarkersForPlaces(results);
      }
    });
  }

  // This function creates markers for each place found in either places search.
  function createMarkersForPlaces(places){
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < places.length; i++) {
      var place = places[i];
      var icon = {
        url: place.icon,
        size: new google.maps.Size(35, 35),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(15, 34),
        scaledSize: new google.maps.Size(25, 25)
      };
      // create a marker for each place // aqueles icones bonitinhos
      var marker = new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location,
        id:  place.place_id
      });
      //CReate a single infowindow to be used with the place details information
      // so that only one is open at once
      var placeInfoWindow = new google.maps.InfoWindow();
      //if a marker is clicked, do a place details search on it in the next function
      marker.addListener('click', function(){
        if (placeInfoWindow.marker == this) {
          console.log("This infowindow already is on this market!");
        } else {
          getPlacesDetails(this, placeInfoWindow);
        }
      });

      placeMarkers.push(marker);
      if (place.geometry.viewport) {
        //only geocodes have viewport
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(places.geometry.location);
      }
    }
    map.fitBounds(bounds);
  }

  /*this is the Place Details search - it's the most detailed so it's only executed
   when a marker is select, indicating the user wants more details  about that place
  */
  function getPlacesDetails(marker, infowindow) {
    var service = new google.maps.places.PlacesService(map);
    service.getDetails({
      placeId: marker.id
    }, function(place, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        //set the marker property on this infowindow so it isn't created again.
        infowindow.marker = marker;
        var innerHTML = '<div>';
        if (place.name) {
          innerHTML += '<strong>' + place.name + '</strong>';
        }
        if (place.formatted_address) {
          innerHTML += '<br>' + place.formatted_address;
        }
        if (place.formatted_phone_number) {
          innerHTML += '<br>' + place.formatted_phone_number;
        }
        if (place.opening_hours) {
          innerHTML += '<br><br><strong>Hours:</strong><br>' +
            place.opening_hours.weekday_text[0] + '<br>' +
            place.opening_hours.weekday_text[1] + '<br>' +
            place.opening_hours.weekday_text[2] + '<br>' +
            place.opening_hours.weekday_text[3] + '<br>' +
            place.opening_hours.weekday_text[4] + '<br>' +
            place.opening_hours.weekday_text[5] + '<br>' +
            place.opening_hours.weekday_text[6];
        }
        if (place.photos) {
          innerHTML += '<br><br><img src="' + place.photos[0].getUrl(
              {maxHeight: 100, maxWidth: 200}) + '">';
        }
        innerHTML += '</div>';
        infowindow.setContent(innerHTML);
        infowindow.open(map, marker);
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
          infowindow.marker = null;
        });
      }
    });
  }
/*----------------------------GOOGLEMAPS: END------------------------*/
var vm = new ViewModel();
ko.applyBindings(new ViewModel);
