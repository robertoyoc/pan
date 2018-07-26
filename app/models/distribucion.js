import DS from 'ember-data';

export default DS.Model.extend({
	tipo: DS.attr('string'),
	cantidad: DS.attr('number', { defaultValue: 1}),

	distribuido: DS.belongsTo('distribuido'),
	receta: DS.belongsTo('receta'),
	mprima: DS.belongsTo('mprima'),

	reparto: DS.belongsTo('reparto')
});
