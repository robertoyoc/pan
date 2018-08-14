import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
import { inject as service } from '@ember/service';
import Table from 'ember-light-table';

export default Controller.extend({
  columns: computed(function() {
    return [{
      label: 'Propietario',
      valuePath: 'propietario.nombreCompleto',
    }, {
      label: 'Hora',
      valuePath: 'fechaUnix',
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
});
