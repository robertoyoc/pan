import DS from 'ember-data';

export default DS.Model.extend({
  pedidos: DS.hasMany('pedidos'),
  fecha: DS.attr('string'),
  propietario: DS.belongsTo('account')
});
