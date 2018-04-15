import { computed } from '@ember/object';
import DS from 'ember-data';
import {all} from 'rsvp' 

export default DS.Model.extend({
  	nombre: DS.attr('string'),

  	productosId: DS.attr({
		defaultValue: function(){
			return []
		}
	}),

	productos: computed('productosId', function(){
		return all(
			this.get('productosId').map((producto)=>{
				let id = producto.id
				let path  =producto.tipo
				return this.store.findRecord(path, id)
			})
		)
	})
});