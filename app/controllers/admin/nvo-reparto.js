import Controller from '@ember/controller';

export default Controller.extend({
	actions: {
		foo(){
			
		},
		changePrima(){
			this.set('selectedPrima', undefined)
		},
		agregar(producto, cantidad){
			this.get('model.reparto.distribuciones').createRecord({
				producto: producto,
				cantidad: cantidad
			})

		},
		delete(distribucion){
			distribucion.destroyRecord()
		}
	}
});
