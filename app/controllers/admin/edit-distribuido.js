import Controller from '@ember/controller';
import { inject as service } from "@ember/service";
import { computed } from '@ember/object';
import { isEmpty } from "@ember/utils";
import DS from 'ember-data';

export default Controller.extend({
	currentUser: service(),

	sucursalActual: computed(function(){
			return DS.PromiseObject.create({
					promise: this.get('currentUser.account').then((account)=>{
							return account.get('administradorDe')
					})
			})
	}),
	currentSucursal: computed('sucursalActual.content', function(){
	return this.get('sucursalActual.content')
	}),


	currentCategoria: computed('model', function(){
		if(!isEmpty(this.get('model.categoria'))) {
			return DS.PromiseObject.create({
				promise: this.get('model.categoria').then((categoria)=>{
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
