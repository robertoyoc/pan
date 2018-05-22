import DS from 'ember-data';
import { computed } from "@ember/object";
import { isBlank } from '@ember/utils';
import moment from 'moment';

export default DS.Model.extend({
  sucursal: DS.belongsTo('sucursal'),
  pedidos: DS.hasMany('pedidos'),
  fecha: DS.attr('string'),
  status: DS.attr('string'),

  ticketUrl: DS.attr('string'),

  hora: computed('fecha', function() {
    let date = moment(this.get('fecha'))
    return `${date.hour()}:${date.minutes()}`

  }),
  fechaUnix: computed('fecha', function() {
    return (!isBlank(this.get('fecha'))) ? moment.utc(this.get('fecha')).unix() : 0;
  }).meta({ serialize: true }),

  fechaPago: DS.attr('string'),
  fechaUnixPago: computed('fechaPago', function() {
    return (!isBlank(this.get('fechaPago'))) ? moment.utc(this.get('fechaPago')).unix() : 0;
  }).meta({ serialize: true }),

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

  propietario: DS.belongsTo('account')
});
