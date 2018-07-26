import DS from 'ember-data';

export default DS.Model.extend({
	fecha: DS.attr('string'),

	origen: DS.belongsTo('sucursal', { inverse: 'enviados' }),
	destino: DS.belongsTo('sucursal', { inverse: 'recibidos' }),

	distribuciones: DS.hasMany('distribucion'),
});
