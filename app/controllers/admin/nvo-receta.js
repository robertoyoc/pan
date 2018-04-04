import Controller from '@ember/controller';

export default Controller.extend({
	actions: {
        nuevoProducto(){
            this.transitionToRoute('admin.productos');
        }
	}
});