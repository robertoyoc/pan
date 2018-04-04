import DS from 'ember-data';

export default DS.Model.extend({
	producto: DS.belongsTo('producto', {inverse:'existencias'}),
	cantidad: DS.attr('number'),
	sucursal: DS.belongsTo('sucursal')
});
