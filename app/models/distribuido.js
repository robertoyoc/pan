import DS from 'ember-data';

export default DS.Model.extend({
	nombre: DS.attr('string'),
	precio: DS.attr('number'),
	unidad: DS.attr('string'),
	imageUrl: DS.attr('string'),

	categoria: DS.belongsTo('categoria'),
	existencias: DS.hasMany('existence'),
});
