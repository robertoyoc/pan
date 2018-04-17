import DS from 'ember-data';
import { computed } from '@ember/object';
import {all} from 'rsvp' 

export default DS.Model.extend({
  	nombre: DS.attr('string'),

  	productosId: DS.attr(),
  	

	productosPromise: computed('productosId.@each.id', function(){
		if (!this.get('productosId'))
			return []

		return DS.PromiseObject.create({
			promise: all(	
				this.get('productosId').map((producto)=>{
					let id = producto.id
					let path  =producto.tipo
					return this.store.findRecord(path, id)
				})
			)
		})
	}),
	productos: computed('productosPromise.content', function(){
		return this.get('productosPromise.content')
	}), 
	init(){
  		this._super(...arguments)
  		if(!this.get('productosId'))
  			this.set('productosId', [])
  	}
});