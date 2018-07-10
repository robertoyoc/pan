import Controller from '@ember/controller';
import { computed, observer, get } from '@ember/object';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import { all } from 'rsvp';
import DS from 'ember-data'

const perfiles = [
  { name: 'Empresa'},
  { name: 'Repartidor'},
  { name: 'Cliente'}
  ];

export default Controller.extend({
  perfiles,
  store: service(),
  session: service(),
  currentUser: service(),
  user: computed('session.isAuthenticated', function(){
    if(this.get('session.currentUser.email')){
      let email = this.get('session.currentUser.email')
      let res = email.split("@")
      return res[0];
    }
    else
      return null


  }),

  userActual: computed('currentUser', function(){
    if(!isEmpty(this.get('currentUser.account'))) {
      return DS.PromiseObject.create({
        promise: this.get('currentUser.account').then((account)=>{
            return account;
        })
      });
    } else {
      return null
    }
  }),

  cartTotal: computed('model.cart.pedidos.@each.total', function(){
    let total =0;
    if(this.get('model.cart')){
      this.get('model.cart.pedidos').forEach((pedido)=>{
        if(pedido.get('total')){
          total = total + pedido.get('total');
        }
      });

      if(this.get('model.cart.pedidos.length')>0&&total!=0)
        this.set("model.cart.valor", total)

    }


    return total;
  }),

  init(){
    //console.log(this.get('model.cart'))
    this.set('tooManyRequest', false)
    window.$(window).on('beforeunload', () => {
      if(this.get('model.cart.hasDirtyAttributes'&&this.get('model.cart.valor')>0)){
        all([
          this.get('model.cart.pedidos').invoke('save'),
          this.get('model.cart').save()
        ])
      }
    });
  },

  actions:{

    hi(){
      this.set('loginuserError', 'correo incorrecto')
      window.$('#loginuser').removeClass('valid')
      window.$('#loginuser').addClass('invalid')

    },
    addtoCart(producto){

      let account = this.get('currentUser.account');
      let cart = this.get('model.cart')

      let isNew = true;
      let pedidoId;
      cart.get('pedidos').forEach((pedido)=>{
        if(pedido.get('producto.id')==producto.get('id')){
          isNew=false;
          pedidoId = pedido.get('id');
        }

      });

      if(isNew){
        cart.get('pedidos').createRecord({
          producto: producto,
          cantidad: 1
        });
      }
      else{
        let pedido = cart.get('pedidos').findBy('id', pedidoId)
        pedido.set('cantidad', pedido.get('cantidad')+1)
      }

      return all([
        cart.get('pedidos').invoke('save'),
        cart.save()
      ])

    },

    activateError(id){
      window.$(id).removeClass('valid');
      window.$(id).addClass('invalid');
    },
    desactivateError(id){
      window.$(id).removeClass('invalid');
      window.$(id).addClass('valid');
    },

    signOut(){
      window.swal({
        title: 'Estás seguro?',
        text: 'Tu sesión será cerrada',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, salir!',
        cancelButtonText: 'No',
        confirmButtonClass: 'confirm-class',
        cancelButtonClass: 'cancel-class',
        closeOnConfirm: false,
        closeOnCancel: false

      }).then(()=>{
        this.get('session').close();
          this.send('sessionChanged')
          window.swal({
            type: 'success',
            title: 'Sesión cerrada!',
            text: 'Gracias por tu visita.',
            timer: 500
          });
      }).catch(()=>{});



    },
    perfil(){
      window.$('.button-collapse').sideNav('show');
    },
    foo(){},
    showSlide(){
      window.$('.button-collapse').sideNav('show');
    },
    cerrar(){
      window.$('.button-collapse').sideNav('hide');

    },
    login(){
      window.$('#login').modal('open'); //debe ser window para que lo busque en toda la ventana
      window.$('#loginuser').focus();
      window.$('#loginuser').removeClass('invalid');
      window.$('#loginpass').removeClass('invalid');
      window.$('#loginpass').removeClass('valid');
      window.$('#loginuser').removeClass('valid');
      window.$(".material-icons").removeClass("active");

    },
    register(){
      window.$('#register').modal('open');
      window.$(".material-icons").removeClass("active");
      window.$(".validate").removeClass('valid');

    },
    pedidos(){
       window.$('#pedidos').modal('open');

    },
    map(sucursal){
      switch(sucursal){
        case 'villita':
            window.$("#map").html('<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3746.351467719986!2d-98.74447488559768!3d20.119379523575294!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d109fc06ef1ecb%3A0x5b1aef217f5a91f!2sPan+La+Villita!5e0!3m2!1ses!2smx!4v1499548467780" width="100%" height="450" frameborder="0" style="border:0" allowfullscreen></iframe>');
        break;
        case 'sanjavier':
          window.$("#map").html('<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3746.910588810391!2d-98.75422258559806!3d20.09602412434006!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1a0b4420a6009%3A0xc5beab327d0e9342!2sPan+La+Villita!5e0!3m2!1ses!2smx!4v1499548405346" width="100%" height="450" frameborder="0" style="border:0" allowfullscreen></iframe>');
        break;
      }
    }
  }
});
