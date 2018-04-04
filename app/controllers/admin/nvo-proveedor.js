import Controller from '@ember/controller';

export default Controller.extend({
	actions: {
		nuevoProveedor() {
			this.transitionToRoute('admin.proveedores');
		}
	}
});
