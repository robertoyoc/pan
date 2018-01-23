import { get } from '@ember/object';
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { buildValidations, validator } from 'ember-cp-validations';

const Validations = buildValidations({
  user: validator('presence', true),
  pass: [
    validator('presence', true),
    validator('presence', true)
  ]
})

export default Component.extend(Validations, {
	session: service(),
  	currentUser: service(),
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

        }

      });

    },

    signIn(){
      this.set('isWorking', true)

      this.validate().then(({validations})=>{
        if(get(this, 'validations.isValid')){
          let newemail = this.get("user") + "@panlavillita.mx";
          let pass = this.get("pass");
          this.get('session').open('firebase', {
            provider: 'password',
            email: newemail,
            password: pass
          }).then(()=>{

            this.set('user', undefined);
            this.set('pass', undefined);
            window.$('#login').modal('close');
            this.set('isWorking', false)

            this.send('sessionChanged');

          }).catch((error)=>{
            switch(error.code){
              case "auth/user-not-found":
              this.set('loginUserError', 'Usuario no encontrado.')
              this.send('activateError', '#loginuser')
              break;
              case "auth/wrong-password":
              this.set('loginPassError', 'Contraseña incorrecta.')
              this.send('activateError', '#loginpass')
              break;
              case "auth/too-many-requests":
              this.set('loginPassError', 'Demasiadas peticiones.')
              this.send('activateError', '#loginpass')

            }
            this.set('isWorking', false)
            
          });
        }
      }).catch((error)=>{
      });


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




