import { computed, observer, get } from '@ember/object';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { all } from 'rsvp';
const perfiles = [
  { name: 'Empresa'},
  { name: 'Repartidor'},
  { name: 'Cliente'}
  ];

export default Controller.extend({
  perfiles,
  firebase: service('firebaseApp'),
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

      if(this.get('model.cart.hasDirtyAttributes')){
        all([
          this.get('model.cart.pedidos').invoke('save'),
          this.get('model.cart').save()
        ])
      }

    }


    return total;
  }),

  init(){
    //console.log(this.get('model.cart'))
    this.set('tooManyRequest', false)
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
    toogleError(data, attr){
      data.validate().then(({validations})=>{
        switch(attr){
          case 'user':
          if(get(data, 'validations.attrs.user.isInvalid')){
            this.set('loginUserError', 'Este campo no puede estar vacío.')
            this.send('activateError', '#loginuser')
          }
          else{
            this.set('loginUserError', null);
            this.send('desactivateError', '#loginuser')
          }
          break;
          case 'pass':
          if(get(data, 'validations.attrs.pass.isInvalid')){
            if(get(data, 'validations.attrs.pass.error.type')=='presence')
              this.set('loginPassError', 'Este campo no puede estar vacío.')
            else
              this.set('loginPassError', 'La contraseña es demasiado corta.')
            this.send('activateError', '#loginpass')
          }
          else{
            this.set('loginPassError', null);
            this.send('desactivateError', '#loginpass')
          }
          break;
          case 'regUser':
            if(get(data, 'validations.attrs.user.isInvalid')){
              this.set('regUserError', 'Este campo no puede estar vacío.')
              this.send('activateError', '#regUser')
            }
          break;
          case 'regPass':
            if(get(data, 'validations.attrs.pass.isInvalid')){
              if(get(data, 'validations.attrs.pass.error.type')=='presence')
                this.set('regPassError', 'Este campo no puede estar vacío.')
              else
                this.set('regPassError', 'La contraseña es demasiado corta.')
              this.send('activateError', '#regPass')
            }else{
              this.set('regPassError', null);
              this.send('desactivateError', '#regPass')
            }

          break;
          case 'regNombre':
            if(get(data, 'validations.attrs.nombre.isInvalid')){
              this.set('regNombreError', 'Este campo no puede estar vacío.')
              this.send('activateError', '#regNombre')
            }
          break;
          case 'regApellido':
            if(get(data, 'validations.attrs.apellido.isInvalid')){
              this.set('regApellidoError', 'Este campo no puede estar vacío.')
              this.send('activateError', '#regApellido')
            }
          break;

        }

      });

    },


    signIn(data){

      data.validate().then(({validations})=>{
        if(get(data, 'validations.isValid')){
          let newemail = data.user + "@panlavillita.mx";
          this.get('session').open('firebase', {
            provider: 'password',
            email: newemail,
            password: data.pass
          }).then(()=>{

            this.set('model.login.user', null);
            this.set('model.login.pass', null);
            window.$('#loginuser').removeClass('invalid');
            window.$('#loginpass').removeClass('invalid');
            window.$('#loginpass').removeClass('valid');
            window.$('#loginuser').removeClass('valid');
            window.$('#login').modal('close');
            data.destroyRecord();

            this.send('sessionChanged');

          }).catch((error)=>{
            switch(error.code){
              case "auth/user-not-found":
              this.set('loginUserError', 'Usuario no encontrado.')
              break;
              case "auth/wrong-password":
              this.set('loginPassError', 'Contraseña incorrecta.')
              break;
              case "auth/too-many-requests":
              this.set('loginPassError', 'Demasiadas peticiones.')

            }
            this.send('activateError', '#loginuser')
          });
        }
      });


    },
    signOut(){

      this.get('session').close();
      this.send('sessionChanged')

    },
    perfil(){
      window.$('.button-collapse').sideNav('show');
    },
    createUser(data){

      let Controller = this;
      data.validate().then(()=>{
        if(get(data, 'validations.isValid')){
          let newemail = data.user + "@panlavillita.mx";
          this.get('firebase').auth().createUserWithEmailAndPassword(newemail, data.pass).then((usuario)=>{
            this.get('store').createRecord('account', {
              uid: usuario.uid,
              nombre: data.nombre,
              apellido: data.apellido,
              perfil: "cliente"
            }).save().then(()=>{
              window.swal(
              'Guardado!',
              'La información ha sido almacenada',
              'success'
              ).then(()=>{
                window.$('#register').modal('close');
                this.get('session').open('firebase', {
                  provider: 'password',
                  email: newemail,
                  password: data.pass
                })
              })

            });
          }).catch(function(error) {
              // Handle Errors here.
            // var errorCode = error.code;
            // var errorMessage = error.message;

            // ...
            switch(error.code){
              case "auth/email-already-in-use":
              Controller.set("regUserError", "Usuario ya se encuentra registrado.")
              Controller.send('activateError', "#regUser")
            }
          });
        }


      })


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
    },
    register(){
      window.$('#register').modal('open');
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
