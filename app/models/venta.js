import DS from 'ember-data';
import { computed } from "@ember/object";
import { isBlank } from '@ember/utils';
import moment from 'moment';

export default DS.Model.extend({
  sucursal: DS.belongsTo('sucursal'),
  pedidos: DS.hasMany('pedidos'),
  fecha: DS.attr('string'),
  fechaUnix: computed('fecha', function () {
    	return (!isBlank(this.get('fecha'))) ? moment.utc(this.get('fecha')).unix() : 0;
  }).meta({ serialize: true }),
    
  importeTotal: computed('pedidos.@each.total', function() {
    let sum = 0;
    this.get('pedidos').forEach((pedido) => {
      sum += parseInt(pedido.get('total'));
    });
    return sum;
  }).meta({ serialize: true }),

  propietario: DS.belongsTo('account')
});
