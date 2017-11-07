import Ember from 'ember';

export default Ember.Service.extend({
  store: Ember.inject.service(),
  currentUser: Ember.inject.service(),
  _cart: null,
  init(){
    this._super(...arguments);
    //window.localStorage.removeItem('villitaCart')


    let isCart = window.localStorage.getItem('villitaCart');
    let payload;
    let cart;

    if(isCart){
      cart = window.localStorage.getItem('villitaCart');
      cart = JSON.parse(cart);
      this.set('_cart', cart);
    }
    else{
      cart = this.get('store').peekAll('cart');
      if(Ember.isEmpty(cart)){
        let _cart = this.get('store').createRecord('cart', {
          propietario: this.get('currentUser.account')
        })
      this.set('_cart', _cart);
      window.localStorage.setItem('villitaCart', JSON.stringify(this.get('_cart')))
      }

    }
  }

});
