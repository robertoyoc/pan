import EmberObject from '@ember/object';

const google = window.google;

export default EmberObject.extend({

  init(element) {
    //console.log(element)
    //this.set('mapcoder', new google.maps.Map(element));
  },

  createMap(lat, lon) {
    let map = new google.maps.Map(window.$('#map'), { scrollwheel: false, zoom: 10 });
    //this.pinLocation(lat, lon, map);
    return map;
  },

  pinLocation(latitude, longitude, map) {

    var myLatlng = new google.maps.LatLng(latitude,longitude);
    var mapOptions = {
      zoom: 10,
      center: myLatlng
    }
    this.get('mapcoder').setOptions(mapOptions);
  }

});
