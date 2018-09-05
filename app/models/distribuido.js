import DS from 'ember-data';

export default DS.Model.extend({
	nombre: DS.attr('string'),
	unidad: DS.attr('string'),
	imageUrl: DS.attr('string'),

	precio: DS.belongsTo('price'),
	categoria: DS.belongsTo('categoria'),
	existencias: DS.hasMany('existence'),
});
