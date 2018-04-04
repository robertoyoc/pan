import Controller from '@ember/controller';
import { inject as service } from "@ember/service";
import { computed } from '@ember/object';

export default Controller.extend({
    myProveedores: computed(function() {
		return this.get('store').findAll('proveedor')
    }),

    actions: {
    	editProveedor(proveedor) {
    		this.transitionToRoute('admin.edit-proveedor', proveedor.get('id'));
      },
      
      deleteProveedor(proveedor) {
        window.swal({
				title: 'Estás seguro?',
				text: 'El proveedor será eliminado',
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
				proveedor.destroyRecord();
			}).catch(()=>{});
        
    	}
    }
});
