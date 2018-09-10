# My Neighborhood Campo de Ourique

The main goal of this project is to start from zero to a Website based on googleMapsAPI, knockoutJS and a third-party API.
A very challenge project but very rewarding at the end.

A single page application featuring a map(googleMaps) of the neighborhood including highlighted locations, inviting the user to visit and get more information

### googleMapsAPI

The first step was to implement the googleMapsAPI ( the base of the Website).
It was asked for :
* googlemaps with the target on the neighborhood based on latitude and longitude
* InfoWindow with the name of the place, correct latitude and longitude based on data
* Asynchrony and Error Handling.
* A functionality to animate a map marker when either the list item associated with it or the map marker itself is selected.

What I did for extra:
* googleSearch on the Website, allowing the user to search for something specific around Lisbon, (for example: name of a restaurants or in general like: gym )
* specific icon and infowindow for the result of the googleSearch.
* Route and Mode to help and guide the user from where he is to reach Campo de Ourique neighborhood and the places recommended


### knockoutJS Framework - JS/main2.js

KnockoutJS was asked to be implement to:
* handle the list, filter, and any other information on the page that is subject to changing state.
* to create the data for googleMapsAPI
* to data-bind the info from googleMapsAPI and create a list where the user could see more details
* create a filter search through the top places suggested for a more precisely location by clicking after the filter search and return the place the user is looking for.

What I did for extra:
* I add and specific information for each location and a website of each company to be open the link in a new Window

main2.js was build  based on the MVMV ( Model - View - ViewModel)

### Third-party API - Weather - getJSON  - JS/app.js

The third-party API is the weather based on the following link https://openweathermap.org/
* It was required a APIkey
* and the weather was based on Lisbon.
* getJSON was necessary to write the code and connect with the html.
* it shows an accurate information of the weather in real time.


#### Extra Info
 * Bootstrap - to create the view and to make the website responsive for laptops and mobile
 * jQuery was also necessary
 * Comments for each step were made for guiding me through all the coding process

 Thanks!
