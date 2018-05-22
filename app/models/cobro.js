import DS from 'ember-data';
import { computed } from "@ember/object";
import { isEmpty, isBlank } from "@ember/utils";

export default DS.Model.extend({
  venta: DS.belongsTo('venta'),
  pago: DS.attr('number'),
  cambio: DS.attr('number'),
  sucursalId: DS.attr('string'),
  fecha: DS.attr('string'),
  fechaUnix: computed('fecha', function() {
    return (!isBlank(this.get('fecha'))) ? moment.utc(this.get('fecha')).unix() : 0;
  }).meta({ serialize: true }),
  sucursal: computed('sucursalId', function() {
    this.store.findRecord('sucursal', this.get('sucursalId'))
  })

});
