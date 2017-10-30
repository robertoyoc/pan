import EmberObject from '@ember/object';

const google = window.google;

export default EmberObject.extend({

  init(element) {
    // console.log("here")
    this.set('mapcoder', new google.maps.Map(element));
    // console.log("here2")
  },

  createMap(element, lat, lon) {
    let map = new google.maps.Map(element, { scrollwheel: false, zoom: 10 });
    this.pinLocation(lat, lon, map);
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
