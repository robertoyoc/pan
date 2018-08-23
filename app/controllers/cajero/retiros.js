import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { isEmpty, isBlank } from '@ember/utils';
import { computed } from '@ember/object';
import Table from 'ember-light-table';
import moment from 'moment';
import DS from 'ember-data';

export default Controller.extend({
  currentDayUnix: computed('currentDay', function(){
    return moment(this.get('currentDay')).format('x');
  }),

  height: '70vh',
  columns: computed(function() {
    return [{
      label: 'Fecha de Expedición',
      valuePath: 'fechaExpedicion',
      cellComponent: 'dt-date'
    }, {
      label: 'Hora de Expedición',
      valuePath: 'fechaExpedicion',
      cellComponent: 'dt-hour'
    }, {
      label: 'Hora de Cobro',
      valuePath: 'fechaCobro',
      cellComponent: 'dt-hour'
    }, {
      label: 'Cantidad',
      valuePath: 'cantidad',
      cellComponent: 'price-wrapper'
    }, {
      label: 'Destinatario',
      valuePath: 'destinatario',
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
  sort: 'fechaExpedicion',
  filteredModel:computed('model', function(){
    return this.get('model').filter(function(item){
      return item.get('fechaExpedicion') > 0;
    });
  }),

  actions: {
    changeFecha(){
       let fecha=moment().format(event.target.dataset.pick)
       this.transitionToRoute({ queryParams: { date: fecha}});
    },

    openModal(retiro) {
      this.set('selectedRetiro', retiro)
      window.$('#modal1').modal('open');
    },

    sendRequest(retiro) {
      retiro.set('fechaCobro', moment().unix());
      retiro.set('status', 'Entregado');
      retiro.save().then(() => {
        window.swal(
          'Éxito',
          'El retiro ha sido entregado.',
          'success'
        )
      })

    }
  }

});
