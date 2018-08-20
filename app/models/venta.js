import DS from 'ember-data';
import { computed } from "@ember/object";
import { isBlank } from '@ember/utils';

export default DS.Model.extend({
  fechaExpedicion: DS.attr('number'),
  fechaPago: DS.attr('number'),
  status: DS.attr('string', {defaultValue: 'En Proceso'}),
  ticketUrl: DS.attr('string'),

  propietario: DS.belongsTo('account'),
  sucursal: DS.belongsTo('sucursal'),
  cobro: DS.belongsTo('cobro'),
  pedidos: DS.hasMany('pedidos'),

  importeTotal: computed('pedidos.@each.total', function() {
    let sum = 0;
    this.get('pedidos').forEach((pedido) => {
      if(!pedido.get('isCourtesy')) {
        sum += parseInt(pedido.get('total'));
      }
    });
    //console.log(sum)
    return sum;
  }).meta({ serialize: true }),

  importeCortesia: computed('pedidos.@each.total', function() {
    let sum = 0;
    this.get('pedidos').forEach((pedido) => {
      if(pedido.get('isCourtesy')) {
        sum += parseInt(pedido.get('total'));
      }
    });
    //console.log(sum)
    return sum;
  }).meta({ serialize: true }),
});
