import Controller from '@ember/controller';
import { computed } from "@ember/object";

export default Controller.extend({
    actions: {
        editCajero(cajero) {
			this.transitionToRoute('dueno.edit-cajero', cajero.get('id'))
        },
        
        deleteCajero(cajero) {
        window.swal({
				title: 'Estás seguro?',
				text: 'El cajero será eliminado',
				type: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Si, eliminar',
				cancelButtonText: 'No',
				confirmButtonClass: 'confirm-class',
				cancelButtonClass: 'cancel-class',
				// closeOnConfirm: false,
				// closeOnCancel: false
			}).then(()=>{
				cajero.destroyRecord();
			}).catch(()=>{});
        
    	}
    }
});
