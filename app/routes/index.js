import { hash } from 'rsvp';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default Route.extend({
  session: service(),
  store: service(),
  currentUser: service(),

  beforeModel(){
    return this.get('session').fetch().catch(function() {
    })
  },

  model(){
    return this.store.createRecord('sucursal')
        
    // if(this.get('session.currentUser.uid')){
    //   return this.get('store').query('account', {
    //     orderBy: 'uid',
    //     equalTo: this.get('session.currentUser.uid'),
    //     limitToLast: 1
    //   }).then((account) => {
    //     let _account = account.get('firstObject');
    //     return this.get('store').query('cart', {
    //       orderBy: 'propietario',
    //       equalTo: _account.get('id'),
    //       limitToLast: 1
    //     }).then((cart)=>{
    //       let promises = [];
    //       if(Ember.isEmpty(cart)){
    //         return hash({
    //           cart: this.get('store').createRecord('cart', {
    //             valor: 0,
    //             propietario: _account
    //           }),
    //           productos: this.get('store').findAll("producto")
    //         });
    //       }
    //       else{
    //         return hash({
    //           cart: cart.get('firstObject'),
    //           productos: this.get('store').findAll("producto")
    //         });
    //       }
    //     })
    //   });
    // }
    // else{
    //   return hash({
    //     cart: null,
    //     productos: this.get('store').findAll("producto"),
    //   });
    // }






  },
  afterModel(model){
    model.get('properties').createRecord({
        nombre: 'central'
    }).save()
    model.save()
  },
  actions: {
    sessionChanged: function() {
      this.refresh()
    },
    // willTransition(){
    //   if(this.get('model.cart.hasDirtyAttributes')){
    //     debugger
    //     all([
    //       this.get('model.cart.pedidos').invoke('save'),
    //       this.get('model.cart').save()
    //     ])
    //   }
    // }
  }

});
