import Ember from 'ember';

export default Ember.Component.extend({
  maps: Ember.inject.service(),

  didInsertElement() {
    this._super(...arguments);
    let lat = this.get('lat');
    let lon = this.get('lon');
    let mapElement = this.get('maps').getMapElement(lat, lon);
    this.$('.map-container').append(mapElement);
  }
});
