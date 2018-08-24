import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { isEmpty, isBlank } from '@ember/utils';
import { computed } from '@ember/object';
import Table from 'ember-light-table';
import moment from 'moment';
import DS from 'ember-data';

export default Controller.extend({
  currentUser: service(),
  currentDayUnix: computed('currentDay', function(){
    return moment(this.get('currentDay')).format('x');
  }),

  height: '70vh',
  columns: computed(function() {
    return [{
      label: 'Fecha',
      valuePath: 'cobro.venta.fechaExpedicion',
      cellComponent: 'dt-date'
    }, {
      label: 'Hora de Expedición',
      valuePath: 'cobro.venta.fechaExpedicion',
      cellComponent: 'dt-hour'
    }, {
      label: 'Hora de Cobro',
      valuePath: 'cobro.fecha',
      cellComponent: 'dt-hour'
    }, {
      label: 'Cantidad',
      valuePath: 'cobro.venta.importeTotal',
			cellComponent: 'price-wrapper'
    }, {
      label: 'Status',
      valuePath: 'status',
    }, {
      label: 'Acciones',
      valuePath: 'id',
			sortable: false,
			cellComponent: 'dt-cancel'
    }];
  }),
  sort: 'cobro.venta.fechaExpedicion',

  selectedSucursaal: computed('selectedRequest', function(){
    if(!isBlank(this.get('selectedRequest'))){
      return DS.PromiseObject.create({
        promise: this.get('selectedRequest.sucursal').then((sucursal)=>{
          return sucursal;
        })
      });
    } else {
      return null;
    }
  }),
  selectedSucursal: computed('selectedSucursaal.content', function(){
    return this.get('selectedSucursaal.content');
  }),
  selectedCajeroo: computed('selectedRequest', function(){
    if(!isBlank(this.get('selectedRequest'))){
      return DS.PromiseObject.create({
        promise: this.get('selectedRequest.cajero').then((cajero)=>{
          return cajero;
        })
      });
    } else {
      return null;
    }
  }),
  selectedCajero: computed('selectedCajeroo.content', function(){
    return this.get('selectedCajeroo.content');
  }),


  actions: {
    changeFecha(){
       let fecha=moment().format(event.target.dataset.pick)
       this.transitionToRoute({ queryParams: { date: fecha}});
    },

    openModal(request) {
      this.set('selectedRequest', request);
      window.Materialize.updateTextFields();
      window.$('#modal1').modal('open');
    },

    sendApproval(request) {
      request.set('status', "Aprobada")
      request.get('cobro.venta').then((venta) => {
        venta.set('status', "Cancelada");
        venta.save()
      }).then(() => {
        request.save()
      })

    },
    sendDenial(request) {
      request.set('status', "Denegada")
      request.get('cobro.venta').then((venta) => {
        venta.set('status', "Cancelación Denegada");
        venta.save()
      }).then(() => {
        request.save()
      })
    }
  }
});
