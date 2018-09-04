import Controller from '@ember/controller';
import { inject as service } from "@ember/service";
import { computed } from '@ember/object';
import DS from 'ember-data';

export default Controller.extend({
	currentUser: service(),
	store: service(),

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

	actions: {
        nuevoProducto(){
            this.transitionToRoute('admin.productos');
        }
	}
});
