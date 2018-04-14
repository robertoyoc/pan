import { get } from '@ember/object';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { buildValidations, validator } from 'ember-cp-validations';

const Validations = buildValidations({
  user: validator('presence', true),
  pass: [
    validator('presence', true),
    validator('length', {
      min: 6
    })
  ],
  nombre: validator('presence', true),
  apellido: validator('presence', true)
})

export default Controller.extend(Validations, {
	firebase: service('firebaseApp'),
	store: service(),
	session: service(),
	actions:{
	toogleError(attr){
      this.validate().then(({validations})=>{
        switch(attr){
          case 'user':
          if(get(this, 'validations.attrs.user.isInvalid')){
            this.set('loginUserError', 'Este campo no puede estar vacío.')
            this.send('activateError', '#loginuser')
          }
          else{
            this.set('loginUserError', null);
            this.send('desactivateError', '#loginuser')
          }
          break;
          case 'pass':
          if(get(this, 'validations.attrs.pass.isInvalid')){
            if(get(this, 'validations.attrs.pass.error.type')=='presence')
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
            if(get(this, 'validations.attrs.user.isInvalid')){
              this.set('regUserError', 'Este campo no puede estar vacío.')
              this.send('activateError', '#regUser')
            }
          break;
          case 'regPass':
            if(get(this, 'validations.attrs.pass.isInvalid')){
              if(get(this, 'validations.attrs.pass.error.type')=='presence')
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
            if(get(this, 'validations.attrs.nombre.isInvalid')){
              this.set('regNombreError', 'Este campo no puede estar vacío.')
              this.send('activateError', '#regNombre')
            }
          break;
          case 'regApellido':
            if(get(this, 'validations.attrs.apellido.isInvalid')){
              this.set('regApellidoError', 'Este campo no puede estar vacío.')
              this.send('activateError', '#regApellido')
            }
          break;

        }

      });

    },


    createUser(){



      function lookForUser(uid, context){
        return context.store.findRecord('account', uid).then((usuario)=>{
          return usuario
        }).catch(()=>{
          return lookForUser(uid, context)
        })

      }






      this.set('isWorking', true)
      let controller = this;
      this.validate().then(()=>{
        if(get(this, 'validations.isValid')){
          let newemail = this.get("user") + "@panlavillita.mx";
          let nombre = this.get("nombre");
          let apellido = this.get("apellido");
          let pass = this.get("pass");
          this.get('firebase').auth().createUserWithEmailAndPassword(newemail, pass).then((usuario)=>{
            let context = this
            lookForUser(usuario.uid, this).then((createdUsuario)=>{
              createdUsuario.set('apellido', apellido)
              createdUsuario.set('nombre', nombre)
              createdUsuario.save().then(()=>{
                window.swal(
                  'Guardado!',
                  'La información ha sido almacenada',
                  'success'
                ).then(()=>{
                  this.set('user', undefined);
                  this.set('nombre', undefined);
                  this.set('apellido', undefined);
                  this.set('pass', undefined);
                  this.get('session').open('firebase', {
                    provider: 'password',
                    email: newemail,
                    password: pass
                  }).then(()=>{
                    context.set('isWorking', false)
                    controller.transitionToRoute('index');
                  })
                })

              })
            })
            
            // setTimeout(function(){
            //   let createdUsuario = context.store.findRecord('account', usuario.uid).then(()=>{})
            //   if(createdUsuario){
            //     createdUsuario.set('apellido', apellido)
            //     createdUsuario.set('nombre', nombre)
            //     createdUsuario.save().then(()=>{
            //       context.set('isWorking', false)
            //     })
            //   }
              

            // }, 2000);

            // this.get('store').createRecord('account', {
            //   uid: usuario.uid,
            //   nombre: nombre,
            //   apellido: apellido,
            //   perfil: "cliente"
            // }).save().then(()=>{
            	 
              
              // })

            // });
          }).catch(function(error) {
              // Handle Errors here.
            // var errorCode = error.code;
            // var errorMessage = error.message;

            // ...
            switch(error.code){
              case "auth/email-already-in-use":
              controller.set("regUserError", "Usuario ya se encuentra registrado.")
              controller.send('activateError', "#regUser")
              controller.set('isWorking', false)
            }
          })
        }


      })


    },
    activateError(id){
      window.$(id).removeClass('valid');
      window.$(id).addClass('invalid');
    },
    desactivateError(id){
      window.$(id).removeClass('invalid');
      window.$(id).addClass('valid');
    }
}
});
