import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
import { inject as service } from '@ember/service';
import Table from 'ember-light-table';
import { task } from 'ember-concurrency';

export default Controller.extend({
	currentUser: service(),
	store: service(),

	// DATA-TABLE
	deleteMessage: 'Las existencias serán eliminadas',

	height: '75vh',
	columnsDistrib: computed(function() {
    return [{
      label: 'Nombre',
      valuePath: 'distribuido.nombre',
    }, {
      label: 'Cantidad',
      valuePath: 'cantidad',
    }, {
      label: 'Precio',
      valuePath: 'distribuido.precio.value',
			cellComponent: 'price-wrapper'
    }, {
      label: 'Acciones',
      valuePath: 'distribuido.precio',
			sortable: false,
			cellComponent: 'dt-actions'
    }];
  }),
	columnsReceta: computed(function() {
    return [{
      label: 'Nombre',
      valuePath: 'receta.nombre',
    }, {
      label: 'Cantidad',
      valuePath: 'cantidad',
    }, {
      label: 'Precio',
      valuePath: 'receta.precio.value',
			cellComponent: 'price-wrapper'
    }, {
      label: 'Acciones',
      valuePath: 'receta.precio',
			sortable: false,
			cellComponent: 'dt-actions'
    }];
  }),
	sortD: 'distribuido.nombre',
	sortR: 'receta.nombre',

	actions: {
		editReceta(existencia) {
			this.transitionToRoute('admin.edit-receta', existencia.get('receta.id'))
		},

		editDistribuido(existencia) {
			this.transitionToRoute('admin.edit-distribuido', existencia.get('distribuido.id'))
		},

		delete(existencia) {
				existencia.set('cantidad', 0);
				existencia.save();
				window.swal("Guardado", "Se han eliminado las existencias", "success")
		}
	}
});
