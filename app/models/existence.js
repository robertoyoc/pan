import DS from 'ember-data';

export default DS.Model.extend({
	tipo: DS.attr('string'),
	cantidad: DS.attr('number'),
	limite: DS.attr('number'),

	sucursal: DS.belongsTo('sucursal'),

	distribuido: DS.belongsTo('distribuido'),
	receta: DS.belongsTo('receta'),
	mprima: DS.belongsTo('mprima'),
});
