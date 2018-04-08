import Controller from '@ember/controller';
import { inject as service } from "@ember/service";
import { computed } from '@ember/object';

export default Controller.extend({
	currentUser: service(),
	store: service(),
	
	myDistribuidos: computed(function() {
		//return this.get('store').findAll('distribuido')
		let existenciasList = [];
		return this.get('currentUser.account').then((account)=>{
			let sucursal = account.get('sucursal')
			return this.store.query('existence', {
					orderBy: 'sucursal',
					equalTo: sucursal.get('id')
			}).then((existencias)=>{
				 existencias.forEach((existencia)=>{
                    if(existencia.get('tipo')=='distribuido')
                        existenciasList.pushObject(existencia)
				})
				
			})

		})
	}),
	
	myRecetas: computed(function() {
		return this.get('currentUser.account').then((account)=>{
			let sucursal = account.get('sucursal')
			return this.store.query('existence', {
				filter: {
					tipo: 'receta',
					orderBy: 'sucursal',
					equalTo: sucursal.get('id')
				}
			})

		})
    }),

	actions: {
		// guardar(producto){
		// 	producto.save()
		// }

		editReceta(producto) {
			this.transitionToRoute('admin.edit-receta', producto.get('id'))
		},

		editDistribuido(producto) {
			this.transitionToRoute('admin.edit-distribuido', producto.get('id'))
		},

		delete(producto) {
			window.swal({
				title: 'Estás seguro?',
				text: 'El producto será eliminado',
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
				producto.destroyRecord();
			}).catch(()=>{});
		}
	}
});
