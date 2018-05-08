import DS from 'ember-data';
import { computed } from "@ember/object";


export default DS.Model.extend({
  fecha: DS.attr('string'),
  fechaShort: DS.attr('string'),
  hora: computed('fecha', function() {
    let date = moment(this.get('fecha'))
    return `${date.hour()}:${date.minutes()}`

  }),
  cantidad: DS.attr('number'),
  destinatario: DS.attr('string'),
  status: DS.attr('string', { defaultValue: "Aprobado" }),
  sucursalId: DS.attr('string'),
  sucursal: computed('sucursalId', function() {
    return this.store.findRecord('sucursal', this.get('sucursalId'))
  }),


});
