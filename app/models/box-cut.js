import DS from 'ember-data';
import { computed } from "@ember/object";
import { isBlank } from '@ember/utils';
import moment from 'moment';

export default DS.Model.extend({
    sucursal: DS.belongsTo('sucursal'),

    turno: DS.attr('string'),
    isAutomatic: DS.attr('boolean', { defaultValue: false }),

    fecha: DS.attr('string'),
    fechaUnix: computed('fecha', function() {
      return (!isBlank(this.get('fecha'))) ? moment.utc(this.get('fecha')).unix() : 0;
    }).meta({ serialize: true }),

    cobros: DS.hasMany('cobro'),
    cobrosTotal: computed('cobros.@each.pago', 'cobros.@each.cambio', function() {
      let sum = 0;
      this.get('cobros').forEach((cobro) => {
          sum += parseInt(cobro.get('pago')) - parseInt(cobro.get('cambio'));
      });
      //console.log(sum)
      return sum;
    }).meta({ serialize: true }),

    retiros: DS.hasMany('retiro'),
    retirosTotal: computed('retiros.@each.cantidad', function() {
      let sum = 0;
      this.get('retiros').forEach((retiro) => {
          sum += parseInt(retiro.get('cantidad'));
      });
      //console.log(sum)
      return sum;
    }).meta({ serialize: true }),

    corteAnterior: DS.belongsTo('box-cut'),
    cantidadInicial: computed('corteAnterior', function() {
      let sum = 0;
      this.get('corteAnterior').then((corte) => {
          sum = parseInt(corte.get('caja'));
      });
      //console.log(sum)
      return sum;
    }).meta({ serialize: true }),

    cajal: computed('cantidadInicial', 'cobrosTotal', 'retirosTotal', function() {
      let sum = 0;
      sum = parseInt(this.get('cantidadInicial')) + parseInt(this.get('cobrosTotal') - parseInt(this.get('retirosTotal')));
      //console.log(sum)
      return sum;
    }).meta({ serialize: true }),

});
