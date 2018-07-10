import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from "@ember/service";
import DS from 'ember-data';
import moment from 'moment';
import FindQuery from 'ember-emberfire-find-query/mixins/find-query';


export default Controller.extend(FindQuery,{
    currentUser: service(),

    sucursalActual: computed(function(){
        return DS.PromiseObject.create({
            promise: this.get('currentUser.account').then((account)=>{
                return account.get('sucursal')
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
                let sucursal = account.get('sucursal');
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
});
