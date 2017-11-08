import { hash } from 'rsvp';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default Route.extend({
  session: service(),
  store: service(),

  beforeModel(){
    return this.get('session').fetch().catch(function() {})
    // return this.get('session').fetch().catch(function() {})
  },

  model(){
    return hash({
      cart: this.get('store').createRecord('cart', {
        valor: 0
      }),
      productos: this.get('store').findAll("producto")
    });

  }

});
