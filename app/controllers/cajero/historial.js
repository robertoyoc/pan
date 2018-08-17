import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import Table from 'ember-light-table';
import { isEmpty } from '@ember/utils';
import moment from 'moment';
import DS from 'ember-data';

export default Controller.extend({
	currentUser: service(),
  columns: computed(function() {
    return [{
      label: 'Hora de Expedición',
      valuePath: 'venta.fechaExpedicion',
      cellComponent: 'dt-hour'
    }, {
      label: 'Hora de Cobro',
      valuePath: 'fecha',
      cellComponent: 'dt-hour'
    }, {
      label: 'Cantidad',
      valuePath: 'venta.importeTotal',
			cellComponent: 'price-wrapper'
    }, {
      label: 'Status',
      valuePath: 'venta.status',
    }, {
      label: 'Acciones',
      valuePath: 'id',
			sortable: false,
			cellComponent: 'dt-cancel'
    }];
  }),
  sort: 'venta.fechaExpedicion',

  cajero: computed('currentUser', function(){
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
              return account.get('cajeroDe')
          })
      })
  }),
  currentSucursal: computed('sucursalActual.content', function(){
    return this.get('sucursalActual.content')
  }),


  actions: {
    changeFecha(){
       let fecha=moment().format(event.target.dataset.pick)
       // let fechaUnix = moment.unix(fecha)
       // console.log(fechaUnix)
       this.transitionToRoute({ queryParams: { date: fecha, isToday: false }});
    },

    /*openModal(cobro) {
      this.set('selectedCobro', cobro)
      window.$('#modal1').modal('open');
    },*/

    sendRequest(cobro, motivo) {
      this.store.createRecord('cancelar-request', {
        cobro: cobro,
        motivo: motivo,
        sucursal: this.get('currentSucursal'),
        cajero: this.get('cajero.content'),
      }).save().then(() => {
        cobro.get('venta').then((venta) => {
          venta.set('status', "Cancelación solicitada")
          venta.save()
          window.swal(
            'Solicitud Enviada',
            'Espera la aprobación',
            'success'
          )
        })
      })
    },

    cancel(cobro){
      this.set('selectedCobro', cobro)
      window.$('#modal1').modal('open');
    }

  }
});
