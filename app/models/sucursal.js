import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
	nombre: DS.attr('string'),
	productos: DS.belongsTo('producto'), // needs to be removed
	existencias: DS.belongsTo('existence'),
	
	cajerosId: DS.attr({
		defaultValue: function(){
			return [];
		}
	}),

	cajeros: computed('cajerosId', function(){
		if(this.get('cajerosId').length > 0 ){
			let cajerosList = [];
			this.get('cajerosId').forEach((cajeroId) => {
				this.get('store').findRecord('account', cajeroId).then((record)=>{
					//if(record.get('perfil') == "cajero")
					cajerosList.pushObject(record)
				})
			});
			return cajerosList
			debugger
		} else {
			debugger
			return null;
		}
	}),
});
