import DS from 'ember-data';

export default DS.Model.extend({
	producto: DS.belongsTo('producto'),
	tipo: DS.attr('string'),
	cantidad: DS.attr('number', { defaultValue: 1})
});
