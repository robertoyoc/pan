import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import Table from 'ember-light-table';
import { isEmpty } from '@ember/utils';
import moment from 'moment';
import DS from 'ember-data';

export default Controller.extend({
  currentUser: service(),
  currentDayUnix: computed('currentDay', function(){
    return moment(this.get('currentDay')).format('x');
  }),

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

  actions: {
    changeFecha(){
       let fecha=moment().format(event.target.dataset.pick)
       this.transitionToRoute({ queryParams: { date: fecha}});
    },

    openModal(request) {
      this.set('selectedRequest', request)
      window.$('#modal1').modal('open');
      window.Materialize.updateTextFields()

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
