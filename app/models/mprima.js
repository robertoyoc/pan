import DS from 'ember-data';

export default DS.Model.extend({
	nombre: DS.attr('string'),
	cantidad: DS.attr('number'),
	unidad: DS.attr('string')
});
