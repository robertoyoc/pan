import { computed } from '@ember/object';
import DS from 'ember-data';

export default DS.Model.extend({
  producto: DS.belongsTo('producto'),
  cantidad: DS.attr('number'),
  total: computed('cantidad', function () {
    return this.get('producto.precio')* this.get('cantidad')
  })

});
