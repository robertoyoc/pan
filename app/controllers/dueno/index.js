import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
import DS from 'ember-data'

export default Controller.extend({
    currentUser: service(),

    dueno: computed('currentUser', function(){
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

    actions: {
      signOut(){
        window.swal({
          title: 'Estás seguro?',
          text: 'Tu sesión será cerrada',
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, salir',
          cancelButtonText: 'No',
          confirmButtonClass: 'confirm-class',
          cancelButtonClass: 'cancel-class',
          closeOnConfirm: false,
          closeOnCancel: false

        }).then(()=>{
          this.get('session').close();
          this.transitionToRoute('index');
            window.swal({
              type: 'success',
              title: 'Sesión cerrada!',
              text: 'Gracias por tu visita.',
              timer: 500
            });
        }).catch(()=>{});
      },
    }

});
