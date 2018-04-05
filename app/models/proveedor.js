import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
	nombre: DS.attr('string'),
	productos: DS.hasMany('producto'),
	diasVisita: DS.attr({
		defaultValue: function(){
			return ["lune"];
		}
	}),

	periodoVisita: DS.attr('string'),
	customDias: DS.attr('number')

});
