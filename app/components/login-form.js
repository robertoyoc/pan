import { get } from '@ember/object';
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { buildValidations, validator } from 'ember-cp-validations';

const Validations = buildValidations({
  user: validator('presence', true),
  pass: [
    validator('presence', true),
    validator('length', {
      min: 6
    })
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

    signIn(){

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




