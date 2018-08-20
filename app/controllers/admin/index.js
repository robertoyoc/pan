import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from "@ember/service";
import { isEmpty } from '@ember/utils';
import DS from 'ember-data';
import moment from 'moment';
import FindQuery from 'ember-emberfire-find-query/mixins/find-query';

export default Controller.extend(FindQuery, {
    currentUser: service(),

    admin: computed('currentUser', function(){
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

    sucursalActual: computed(function(){
        return DS.PromiseObject.create({
            promise: this.get('currentUser.account').then((account)=>{
                return account.get('administradorDe')
            })
        })
    }),
    currentSucursal: computed('sucursalActual.content', function(){
		return this.get('sucursalActual.content')
    }),

    turno: computed(function(){
        if(moment().format('HH') < 14) {
            return "Matutino"
        } else {
            return "Vespertino"
        }
    }),

    listaExistente: computed('turno', function(){
        let today = moment(),
            startDate, endDate;
        startDate = today.clone().startOf('day').utc();
        endDate = today.clone().endOf('day').utc();
        return DS.PromiseObject.create({
            promise: this.get('currentUser.account').then((account)=>{
                let sucursal = account.get('administradorDe');
                let context = this;
                return new Promise(function (resolve, reject){
                    context.filterCustom(context.store, 'roll-call', {
                        'turno': ['==', context.get('turno')],
                        'fechaUnix': ['>=', startDate.unix()],
                    }, function(listas){
                        listas.forEach((lista)=>{
                            if(lista.get('fechaUnix') <= endDate.unix()){
                                return resolve(true)
                            }
                        })
                        return resolve(false)
                    })
                })
            })
        })
    }),
   listaExists: computed('listaExistente.content', function(){
		return this.get('listaExistente.content')
    }),

    listaActual: computed('turno', function(){
        let today = moment(),
            startDate, endDate;
        startDate = today.clone().startOf('day').utc();
        endDate = today.clone().endOf('day').utc();

        return DS.PromiseObject.create({
            promise: this.get('currentUser.account').then((account)=>{
                let sucursal = account.get('sucursal');
                let context = this;
                return new Promise(function (resolve, reject){
                    context.filterCustom(context.store, 'roll-call', {
                        'turno': ['==', context.get('turno')],
                        'fechaUnix': ['>=', startDate.unix()],
                    }, function(listas){
                        listas.forEach((lista)=>{
                            if(lista.get('fechaUnix') <= endDate.unix()){
                                return resolve(lista)
                            }
                        })
                        return resolve(null)
                    })
                })
            })
        })
    }),

    currentList: computed('listaActual.content', function(){
		return this.get('listaActual.content')
    }),

    actions: {
      showNav(){
        debugger
        window.$('.button-collapse').sideNav('hide');
      },

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
      }
    }

});
