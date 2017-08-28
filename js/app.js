//intialized hangout locations around San Jose Downtown

var map, restaurantsList, infoWindow, createMarker;
var restaurants = [
  {
    title: 'Philz Coffee',
    location: {
      lat: 37.333607,
      lng: -121.884899
    },
    id: '4a55473ef964a520fcb31fe3'
  },
  {
    title: 'La Victoria',
    location: {
      lat: 37.33542,
      lng: -121.892714
    },
    id: '49c2d651f964a5202e561fe3'
  },
  {
    title: 'Amor Cafe and Tea',
    location: {
      lat: 37.335351,
      lng: -121.886615
    },
    id: '50f71858e4b0a61af5c67758'
  },
  {
    title: 'Whispers Cafe and Creperie',
    location: {
      lat: 37.33384,
      lng: -121.886702
    },
    id: '4af1137ef964a520ace021e3'
  },
  {
    title: 'Paper Plane',
    location: {
      lat: 37.335056,
      lng: -121.889364
    },
    id: '53336ce5498e6ec45340b722'
  },
  {
    title: 'La Lune Pastry Shop',
    location: {
      lat: 37.333729,
      lng: -121.884959
    },
    id: '4e6265768877954de82db9c2'
  }
];

var Restaurant= function(data){
  this.title= data.title;
  this.location= data.location;
  this.id= data.id;
  this.isActive= ko.observable(false);
  this.fourSquareUrl= "https://api.foursquare.com/v2/venues/"+this.id+"?";
  this.img= "";
  this.img_size="75*75";

  var authParams = $.param({
        'client_id': 'YD4NA220SWHVVAZUF00FY1A3AVZV3JNOZOELD1BRWN450PCR',
        'client_secret': 'NTBP012KLEKM0R4UBIBFTS2V4QVQNUEJTX2DLKIPA0AFVOGQ',
        'v': '20130815'
  });

  this.fourSquareUrl+=authParams;

  $.ajax({
    url: this.fourSquareUrl,
    dataType: 'json'
  }).done(function(result){
    var responseData= result.response.venue;
    this.img= responseData.bestPhoto.prefix+this.img_size+responseData.bestPhoto.suffix;
    this.link=responseData.url;
  }).fail(function(){
    console.log("Restaurant API failed");
  });

  this.addMarker=(function(){
    this.marker= new google.maps.Marker({
      position: this.location,
      map: map
    });
  })();
};

var MapViewModel= function(){

  //declare a knockout array to store restaurants list
  restaurantsList= ko.observableArray(restaurants);

  restaurants.forEach(function(each){
    restaurantsList.push(new Restaurant(each));
  });


};

//Initialize map with default center as San Jose downtown
function initMap() {
  var defaultCenter= {lat: 37.335719, lng: -121.886708};

  map = new google.maps.Map(document.getElementById('map'), {
     center: defaultCenter,
     zoom: 8
  });

  google.maps.event.addDomListener(window, 'resize', function(){

		// Adjust the downtown area to center of the window
		map.setCenter(defaultCenter);

	});

};

// function addMarker() {
//
//       var marker = new google.maps.Marker({
//       position: {lat: 37.335719, lng: -121.886708},
//       map: map,
//       title: 'Uluru (Ayers Rock)'
//   });
// }
//
// addMarker();




ko.applyBindings(new MapViewModel());
