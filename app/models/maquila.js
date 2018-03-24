import DS from 'ember-data';

export default DS.Model.extend({
	receta: DS.belongsTo('receta'),
	cantidad: DS.attr('number'),
	produccion: DS.belongsTo('produccion')
});
