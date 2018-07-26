import Component from '@ember/component';
import { computed } from "@ember/object";
import DS from 'ember-data';
import { inject as service } from "@ember/service";

export default Component.extend({
	store: service(),
	currentUser: service(),

	sucursalActual: computed(function(){
			return DS.PromiseObject.create({
					promise: this.get('currentUser.account').then((account)=>{
							return account.get('sucursal')
					})
			})
	}),
	currentSucursal: computed('sucursalActual.content', function(){
		return this.get('sucursalActual.content')
	}),

    actions: {
        guardar(mprima, existencia){
		    mprima.get('existencias').pushObject(existencia)
		    existencia.save().then(()=>{
		        mprima.save().then(()=>{
		 	        window.swal(
	  		            'Materia Prima Añadida',
			            'Guardaste materia prima',
			            'success'
			        ).then(()=>{
					    this.sendAction('nuevoMprima')
				    })
			    })
            })
        }
    }
});
