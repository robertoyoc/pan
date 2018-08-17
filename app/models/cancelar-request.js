import DS from 'ember-data';
import { computed } from "@ember/object"


export default DS.Model.extend({
  cobro: DS.belongsTo('cobro'),
  motivo: DS.attr('string'),
  status: DS.attr('string', { defaultValue: "Pendiente" }),

  sucursal: DS.belongsTo('sucursal'),
  cajero: DS.belongsTo('account'),
});
