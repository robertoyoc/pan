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
		editReceta(producto) {
			this.transitionToRoute('admin.edit-receta', producto.get('id'))
		},

		editDistribuido(producto) {
			this.transitionToRoute('admin.edit-distribuido', producto.get('id'))
		},

		delete(existencia) {
			window.swal({
				title: 'Estás seguro?',
				text: 'Las existencias serán eliminadas',
				type: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Si, eliminar',
				cancelButtonText: 'No',
				confirmButtonClass: 'confirm-class',
				cancelButtonClass: 'cancel-class',
				closeOnConfirm: false,
				closeOnCancel: false
			}).then(()=>{
				existencia.set('cantidad', 0);
				existencia.save();
				window.swal("Guardado", "Se han eliminado las existencias", "success")
			}).catch((error)=>{
				console.log(error)
			});
		}
	}
});
