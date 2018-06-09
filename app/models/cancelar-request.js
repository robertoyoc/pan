import DS from 'ember-data';
import { computed } from "@ember/object"


export default DS.Model.extend({
  cobro: DS.belongsTo('cobro'),
  motivo: DS.attr('string'),
  sucursalId: DS.attr('string'),
  sucursal: computed('sucursalId', function() {
    return this.store.findRecord('sucursal', this.get('sucursalId'))
  }),
  accountId: DS.attr('string'),
  account: computed('accountId', function() {
    return this.store.findRecord('account', this.get('accountId'))
  }),
  status: DS.attr('string', { defaultValue: "En espera" })

});
