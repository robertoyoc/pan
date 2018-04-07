import Controller from '@ember/controller';
import {inject as service} from "@ember/service";
import { all } from 'rsvp';

export default Controller.extend({
	currentUser: service(),

	actions: {
		// {{action 'editExistencia' existencia.producto}}
		editExistencia(mprima){
			this.transitionToRoute('admin.edit-mprima', mprima.get('id'))
		},

		delete(existencia){
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
