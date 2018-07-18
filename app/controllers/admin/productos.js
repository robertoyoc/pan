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

	columns: computed(function() {
    return [{
      label: 'Nombre',
      valuePath: 'producto.nombre',
    }, {
      label: 'Cantidad',
      valuePath: 'cantidad',
    }, {
      label: 'Precio',
      valuePath: 'producto.precio',
			cellComponent: 'price-wrapper'
    }, {
      label: 'Acciones',
      valuePath: 'producto.precio',
			sortable: false,
			cellComponent: 'dt-actions'
    }];
  }),
	sortD: 'producto.nombre',
	sortR: 'producto.nombre',

	actions: {
		editReceta(existencia) {
			this.transitionToRoute('admin.edit-receta', existencia.get('producto.id'))
		},

		editDistribuido(existencia) {
			this.transitionToRoute('admin.edit-distribuido', existencia.get('producto.id'))
		},

		delete(existencia) {
				existencia.set('cantidad', 0);
				existencia.save();
				window.swal("Guardado", "Se han eliminado las existencias", "success")
		}
	}
});
