import Controller from '@ember/controller';

export default Controller.extend({
    actions: {
        editVendedor(vendedor) {
			this.transitionToRoute('dueno.edit-vendedor', vendedor.get('id'))
        },

        deleteVendedor(vendedor) {
        window.swal({
				title: 'Estás seguro?',
				text: 'El vendedor será eliminado',
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
				vendedor.destroyRecord();
			}).catch(()=>{});

    	}
    }
});
