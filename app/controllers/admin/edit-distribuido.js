import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from "@ember/service";
import { isEmpty } from '@ember/utils';
import DS from 'ember-data';

export default Controller.extend({
	currentUser: service(),

	currentCategoria: computed('model', function(){
		if(!isEmpty(this.get('currentUser.categoria'))) {
			return DS.PromiseObject.create({
				promise: this.get('currentUser.categoria').then((categoria)=>{
						return categoria;
				})
			});
		} else {
			return null
		}
	}),

  actions: {
		nuevoProducto(){
			this.transitionToRoute('admin.productos');
		}
	}
});
