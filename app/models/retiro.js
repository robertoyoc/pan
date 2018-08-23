import DS from 'ember-data';
import { computed } from "@ember/object";
import { isEmpty, isBlank } from "@ember/utils";

export default DS.Model.extend({
  fechaExpedicion: DS.attr('number'),
  fechaCobro: DS.attr('number'),
  cantidad: DS.attr('number'),
  destinatario: DS.attr('string'),
  status: DS.attr('string', { defaultValue: "Aprobado" }),

  sucursal: DS.belongsTo('sucursal'),
});
