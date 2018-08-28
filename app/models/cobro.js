import DS from 'ember-data';
import { computed } from "@ember/object";

export default DS.Model.extend({
    fecha: DS.attr('number'),
    pago: DS.attr('number'),
    cambio: DS.attr('number'),

    importe: computed('pago', 'cambio', function() {
      let sum = Number(this.get('pago') - this.get('cambio'));
      return  (sum > 0) ? sum : 0;
    }).meta({ serialize: true }),

    venta: DS.belongsTo('venta'),
    cancelacion: DS.belongsTo('cancelar-request'),

    sucursal: DS.belongsTo('sucursal'),
});
