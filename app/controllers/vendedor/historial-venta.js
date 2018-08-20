import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
import Table from 'ember-light-table';
import moment from 'moment';

export default Controller.extend({
  day: moment().format('DD'),
  month: moment().format('MM'),
  year: moment().format('YYYY'),

  columns: computed(function() {
    return [{
      label: 'Propietario',
      valuePath: 'propietario.nombreCompleto',
    }, {
      label: 'Hora',
      valuePath: 'fechaExpedicion',
      cellComponent: 'dt-hour'
    }, {
      label: 'Importe',
      valuePath: 'importeTotal',
			cellComponent: 'price-wrapper'
    }, {
      label: 'Status',
      valuePath: 'status',
    }, {
      label: 'Ticket',
      valuePath: 'ticketUrl',
			sortable: false,
			cellComponent: 'dt-download'
    }];
  }),
	sort: 'propietario.nombre',

  filteredModel:computed('model', function(){
    return this.get('model').filter(function(item){
      return item.get('fechaExpedicion') > 0;
    });
  })
});
