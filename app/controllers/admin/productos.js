import Controller from '@ember/controller';

export default Controller.extend({
	actions: {
		guardar(producto){
			producto.save()
		}
	}
});
