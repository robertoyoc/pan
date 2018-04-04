import DS from 'ember-data';

export default DS.Model.extend({
	nombre: DS.attr('string'),
	productos: DS.belongsTo('producto'), // needs to be removed
	existencias: DS.belongsTo('existence')

});
