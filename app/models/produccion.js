import DS from 'ember-data';

export default DS.Model.extend({
	sucursal: DS.belongsTo('sucursal'),
	fecha: DS.attr('string'),
	maquilas: DS.hasMany('maquila')
});
