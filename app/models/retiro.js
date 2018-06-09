import DS from 'ember-data';
import { computed } from "@ember/object";
import { isEmpty, isBlank } from "@ember/utils";
import moment from 'moment';

export default DS.Model.extend({
  fecha: DS.attr('string'),
  fechaUnix: computed('fecha', function () {
      return (!isBlank(this.get('fecha'))) ? moment.utc(this.get('fecha')).unix() : 0;
  }).meta({ serialize: true }),
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
    if(!isEmpty(this.get('sucursalId'))){
      return this.store.findRecord('sucursal', this.get('sucursalId'))
    } else {
      return null
    }

  }),


});
