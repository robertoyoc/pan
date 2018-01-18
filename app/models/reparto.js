import DS from 'ember-data';

export default DS.Model.extend({
	sucursal: DS.belongsTo('sucursal'),
	distribuciones: DS.hasMany('distribucion'),
	fecha: DS.attr('date')
});
