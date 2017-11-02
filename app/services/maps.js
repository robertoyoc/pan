import Ember from 'ember';

import MapUtil from '../utils/google-maps';

export default Ember.Service.extend({
  init() {
    if (!this.get('mapUtil')) {
      // this.set('element', this.createMapElement());
      this.set('mapUtil', MapUtil.create());
    }
  },

  getMapElement(lat, lon) {
    this.get('mapUtil').createMap(this.get('element'), lat, lon);
    console.log(window.$('#map'))
    return this.get('element');
  },

  createMapElement() {
    let element = document.createElement('div');
    element.className = 'map';
    return element;
  }
});
