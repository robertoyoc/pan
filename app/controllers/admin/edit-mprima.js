import Controller from '@ember/controller';

export default Controller.extend({
    actions: {
		nuevoMprima(){
			this.transitionToRoute('admin.lista-mprima')
		}
	}
});
