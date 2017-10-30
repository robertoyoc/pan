import Ember from 'ember';

export default Ember.Controller.extend({

  actions:{
    cerrar(){
      this.$('.button-collapse').sideNav('hide');

    },
    login(){
      window.$('#login').modal('open'); //debe ser window para que lo busque en toda la ventana
    },
    register(){
      window.$('#register').modal('open');
    },
    pedidos(){
       window.$('#pedidos').modal('open');
    }
  }
});
