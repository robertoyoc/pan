import DS from 'ember-data';

export default DS.Model.extend({
  propietario: DS.belongsTo('account'),
  venta: DS.belongsTo('venta'),
  valor: DS.attr('number')

});
