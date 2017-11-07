import DS from 'ember-data';

export default DS.Model.extend({
  propietario: DS.belongsTo('account'),
  pedidos: DS.hasMany('pedido'),
  valor: DS.attr('number')

});
