import DS from 'ember-data';

export default DS.Model.extend({
	receta: DS.hasOne('receta'),
	cantidad: DS.attr('number'),
	produccion: DS.belongsTo('produccion')
});
