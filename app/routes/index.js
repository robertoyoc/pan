import Ember from 'ember';

export default Ember.Route.extend({
  session: Ember.inject.service(),
  store: Ember.inject.service(),
  cart: Ember.inject.service(),

  beforeModel(){
    return Ember.RSVP.hash({
      session: this.get('session').fetch().catch(function() {}),
    });

    // return this.get('session').fetch().catch(function() {})




  }

});
