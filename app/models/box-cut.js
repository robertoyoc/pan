import DS from 'ember-data';
import { computed } from "@ember/object";
import { isBlank } from '@ember/utils';
import moment from 'moment';

export default DS.Model.extend({
    sucursal: DS.belongsTo('sucursal'),

    turno: DS.attr('string'),
    fecha: DS.attr('number'),
    // TIPO: Automatic ó Al Momento
    isAutomatic: DS.attr('boolean', { defaultValue: false }),
    ticketUrl: DS.attr('string'),

    // CAJA
    corteAnterior: DS.belongsTo('box-cut', { inverse: 'corteSiguiente' }),
    corteSiguiente: DS.belongsTo('box-cut', { inverse: 'corteAnterior' }),
    // No hay Corte Anterior
    cajaInicial: DS.attr('number'),

    cantidadInicial: computed('corteAnterior', 'cajaInicial', function() {
      if(!isBlank(this.get('corteAnterior'))){
        let sum = 0;
        this.get('corteAnterior').then((corte) => {
            sum = parseInt(corte.get('caja'));
        });
        return sum;
      } else {
        return this.get('cajaInicial');
      }
    }).meta({ serialize: true }),

    cobros: DS.hasMany('cobro'),
    cobrosTotal: computed('cobros.@each.pago', 'cobros.@each.cambio', function() {
      let sum = 0;
      this.get('cobros').forEach((cobro) => {
          sum += parseInt(cobro.get('pago')) - parseInt(cobro.get('cambio'));
      });
      return sum;
    }).meta({ serialize: true }),

    retiros: DS.hasMany('retiro'),
    retirosTotal: computed('retiros.@each.cantidad', function() {
      let sum = 0;
      this.get('retiros').forEach((retiro) => {
          sum += parseInt(retiro.get('cantidad'));
      });
      return sum;
    }).meta({ serialize: true }),

    caja: computed('cantidadInicial', 'cobrosTotal', 'retirosTotal', function() {
      let sum = 0;
      sum = parseInt(this.get('cantidadInicial')) + parseInt(this.get('cobrosTotal') - parseInt(this.get('retirosTotal')));
      //console.log(sum)
      return sum;
    }).meta({ serialize: true }),

});
