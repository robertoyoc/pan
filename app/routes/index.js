import Ember from 'ember';

export default Ember.Route.extend({
  session: Ember.inject.service(),
  store: Ember.inject.service(),

  beforeModel(){
    return this.get('session').fetch().catch(function() {});

  }

});
