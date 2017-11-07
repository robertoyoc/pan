import Ember from 'ember';
const perfiles = [
  { name: 'Empresa'},
  { name: 'Repartidor'},
  { name: 'Cliente'}
  ];

export default Ember.Controller.extend({
  perfiles,
  firebase: Ember.inject.service('firebaseApp'),
  store: Ember.inject.service(),
  session: Ember.inject.service(),
  currentUser: Ember.inject.service(),
  cart: Ember.inject.service(),
  user: Ember.computed('session', function(){
    let email = this.get('session.currentUser.email')
    let res = email.split("@")
    return res[0];
  }),

  init(){
  },

  actions:{
    signIn(user, pass){
      let newemail = user + "@panlavillita.mx";
      this.get('session').open('firebase', {
        provider: 'password',
        email: newemail,
        password: pass
      }).then(()=>{
        window.$('login').modal('close');

      }).catch(()=>{
      });
    },
    signOut(){
      this.get('session').close();

    },
    perfil(){
      window.$('.button-collapse').sideNav('show');
    },
    createUser(nombre, apellido, user, pass){
      let newemail = user + "@panlavillita.mx";
      this.get('firebase').auth().createUserWithEmailAndPassword(newemail, pass).then((usuario)=>{
        this.get('store').createRecord('account', {
          uid: usuario.uid,
          nombre: nombre,
          apellido: apellido,
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
              password: pass
            })
          })

        });
      }).catch(function(/*error*/) {
          // Handle Errors here.
        // var errorCode = error.code;
        // var errorMessage = error.message;

        // ...
      });
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
