//intialized hangout locations around San Jose Downtown

var map, restaurantsList, createMarker, defaultCenter;
var infoWindow=[];
var restaurants = [
  {
    index: 0,
    title: 'Philz Coffee',
    location: {
      lat: 37.333607,
      lng: -121.884899
    },
    id: '4a55473ef964a520fcb31fe3'
  },
  {
    index: 1,
    title: 'La Victoria',
    location: {
      lat: 37.33542,
      lng: -121.892714
    },
    id: '49c2d651f964a5202e561fe3'
  },
  {
    index: 2,
    title: 'Amor Cafe and Tea',
    location: {
      lat: 37.335351,
      lng: -121.886615
    },
    id: '50f71858e4b0a61af5c67758'
  },
  {
    index: 3,
    title: 'Whispers Cafe and Creperie',
    location: {
      lat: 37.33384,
      lng: -121.886702
    },
    id: '4af1137ef964a520ace021e3'
  },
  {
    index: 4,
    title: 'Paper Plane',
    location: {
      lat: 37.335056,
      lng: -121.889364
    },
    id: '53336ce5498e6ec45340b722'
  },
  {
    index: 5,
    title: 'La Lune Pastry Shop',
    location: {
      lat: 37.333729,
      lng: -121.884959
    },
    id: '4e6265768877954de82db9c2'
  }
];

var Restaurant= function(data){
  var self= this;
  self.index= data.index;
  self.title= data.title;
  self.location= data.location;
  self.id= data.id;
  self.clicked= ko.observable(false);
  self.fourSquareUrl= "https://api.foursquare.com/v2/venues/"+this.id+"?";
  self.img= "";
  self.img_size="150x100";
  self.isActive= true;
  self.displayHeader='';
  self.displayImage='';

  var authParams = $.param({
        'client_id': 'YD4NA220SWHVVAZUF00FY1A3AVZV3JNOZOELD1BRWN450PCR',
        'client_secret': 'NTBP012KLEKM0R4UBIBFTS2V4QVQNUEJTX2DLKIPA0AFVOGQ',
        'v': '20170827'
  });

  self.fourSquareUrl+=authParams;

  //Fetching data for restaurant image from FourSquare
  $.ajax({
      url: self.fourSquareUrl,
      dataType: 'json'
    }).done(function(result){
      var responseData= result.response.venue;
      self.img= responseData.bestPhoto.prefix+self.img_size+responseData.bestPhoto.suffix;
      self.link=responseData.url;
      self.displayHeader= '<h3>'+self.title+'</h3>';
      self.displayImage= '<img alt="'+self.title+'" src="'+self.img+'">';
      infoWindow[self.index]= new google.maps.InfoWindow({
          content: self.displayHeader+self.displayImage,
          position: self.location,
          pixelOffset: {width: -2, height: -35}
      });
    }).fail(function(){
      console.log("Restaurant API failed");
    });

  //Calling the marker function to create marker
  self.addMarker= function(){
    if(self.isActive===true){
      self.marker= new google.maps.Marker({
        position: this.location,
        map: map
      });
    }
  };
  self.addMarker();

  //create infoWindow for the marker
  self.openInfoWindow= function(){
    self.marker.setAnimation(google.maps.Animation.DROP);
    infoWindow.forEach(function(window){
      window.close();
    });
    map.setCenter(self.location);
    infoWindow[self.index].open(map);
  };

  self.marker.addListener('click', function() {
    self.marker.setAnimation(google.maps.Animation.DROP);
    infoWindow.forEach(function(window){
      window.close();
    });
    map.setCenter(self.location);
    infoWindow[self.index].open(map);
  });

};

//knockout view model
var MapViewModel= function(){
  var self= this;
  //declared a knockout array to store restaurants list
  this.restaurantsList= ko.observableArray([]);

  restaurants.forEach(function(each){
    self.restaurantsList.push(new Restaurant(each));
  });

  var menu = document.querySelector('#menu');
  var main = document.querySelector('main');
  var drawer = document.querySelector('.nav');

  menu.addEventListener('click', function(e) {
    drawer.classList.toggle('open');
    e.stopPropagation();
  });
  self.searchRestaurant= ko.observable('');
  self.displayRestaurants= ko.computed(function(){
    infoWindow.forEach(function(window){
      window.close();
    });
    return ko.utils.arrayFilter(self.restaurantsList(), function(restaurant) {
      this.filter= self.searchRestaurant().toLowerCase();
      this.targetIndex= restaurant.title.toLowerCase().indexOf(filter);
      if(targetIndex!==-1){
        restaurant.marker.setMap(map);
        return restaurant;
      }
      else{
        restaurant.marker.setMap(null);
        //restaurant.isActive= false;
      }
    });
  });
};

var mapError= function(){
  console.log("Error in loading Google Maps API");
  alert("Error in loading Google Maps API");
};

//Initialize map with default center as San Jose downtown
var initMap= function() {
  defaultCenter= {lat: 37.335719, lng: -121.886708};

  map = new google.maps.Map(document.getElementById('map'), {
     center: defaultCenter,
     zoom: 16
  });

  google.maps.event.addDomListener(window, 'resize', function(){

		// Adjust the downtown area to center of the window
		map.setCenter(defaultCenter);

	});
  ko.applyBindings(new MapViewModel());
};
