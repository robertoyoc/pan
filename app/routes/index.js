import { hash } from 'rsvp';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default Route.extend({
  session: service(),
  store: service(),
  currentUser: service(),

  beforeModel(){
    return this.get('session').fetch().catch(()=>{})
  },

  model(){
    if(this.get('session.currentUser.uid')){
      return this.get('store').query('account', {
        orderBy: 'uid',
        equalTo: this.get('session.currentUser.uid'),
        limitToLast: 1
      }).then((account) => {
        let _account = account.get('firstObject');
        return this.get('store').query('cart', {
          orderBy: 'propietario',
          equalTo: _account.get('id'),
          limitToLast: 1
        }).then((cart)=>{
          let promises = [];
          if(Ember.isEmpty(cart)){
            return hash({
              cart: this.get('store').createRecord('cart', {
                valor: 0,
                propietario: _account
              }).save(),
              productos: this.get('store').findAll("producto")
            });
          }
          else{
            return hash({
              cart: cart.get('firstObject'),
              productos: this.get('store').findAll("producto")
            });
          }
        })
      });
    }
    else{
      return hash({
        cart: null,
        productos: this.get('store').findAll("producto"),
        login: this.get('store').createRecord('login'),
        register: this.get('store').createRecord('register')
      });
    }






  },
  actions: {
    sessionChanged: function() {
      this.refresh()
    }
  }

});
