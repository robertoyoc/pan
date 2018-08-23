import DS from 'ember-data';

export default DS.Model.extend({
  motivo: DS.attr('string'),
  status: DS.attr('string', { defaultValue: "Cancelación Pendiente" }),

  cobro: DS.belongsTo('cobro'),
  sucursal: DS.belongsTo('sucursal'),
  cajero: DS.belongsTo('account'),
});
