import DS from 'ember-data';
import { computed } from "@ember/object"

export default DS.Model.extend({
  venta: DS.belongsTo('venta'),
  pago: DS.attr('number'),
  cambio: DS.attr('number'),
  sucursalId: DS.attr('string'),
  fecha: DS.attr('string'),
  sucursal: computed('sucursalId', function() {
    this.store.findRecord('sucursal', this.get('sucursalId'))
  })

});
