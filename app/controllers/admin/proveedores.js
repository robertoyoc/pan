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
    	}
    }
});
