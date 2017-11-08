import DS from 'ember-data';
import { computed } from '@ember/object';


export default DS.Model.extend({
  propietario: DS.belongsTo('account'),
  pedidos: DS.hasMany('pedido', { async: true }),
  valor: DS.attr('number')

});
