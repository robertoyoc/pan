import Ember from 'ember';

export default Ember.Route.extend({
  session: Ember.inject.service(),
  store: Ember.inject.service(),

  beforeModel(){
    return this.get('session').fetch().catch(function() {})
    // return this.get('session').fetch().catch(function() {})
  },

  model(){
    return Ember.RSVP.hash({
      cart: this.get('store').createRecord('cart', {
        valor: 0
      }),
      productos: this.get('store').findAll("producto")
    });

  }

});
