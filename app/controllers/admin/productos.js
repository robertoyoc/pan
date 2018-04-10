import Controller from '@ember/controller';
import { inject as service } from "@ember/service";
import { computed } from '@ember/object';
import FindQuery from 'ember-emberfire-find-query/mixins/find-query';

export default Controller.extend(FindQuery,{
	currentUser: service(),
	store: service(),

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
