import DS from 'ember-data';
import {computed } from "@ember/object"

export default DS.Model.extend({
	// producto: DS.belongsTo('producto', {polymorphic: true}),
	cantidad: DS.attr('number'),
	//sucursal: DS.belongsTo('sucursal'),
	sucursalId: DS.attr('string'),
	productoId: DS.attr('string'),
	tipo: DS.attr('string'),
	limite: DS.attr('number'),
	producto: computed('productoId','tipo', function(){
		return this.store.findRecord(this.get('tipo'), this.get('productoId'))
	}), 
	sucursal: computed('sucursalId', function(){
		return this.store.findRecord(this.get('sucursalId'))
	})
});
