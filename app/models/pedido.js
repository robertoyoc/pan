import DS from 'ember-data';
import { computed } from '@ember/object';
import { isBlank } from '@ember/utils';

export default DS.Model.extend({
  cantidad: DS.attr('number'),
  tipo: DS.attr('string'),
  isCourtesy: DS.attr('boolean', { defaultValue: false }),

  cart: DS.belongsTo('cart'),
  venta: DS.belongsTo('venta'),
  existencia: DS.belongsTo('existence'), // INSEGURO, Implementar en Cloud

  productoId: DS.attr('string'),
  producto: computed('tipo', 'productoId', function(){
      if(this.get('tipo'))
        return this.store.findRecord(this.get('tipo'), this.get('productoId'));
      else return null;
  }),

  total: computed('producto.precio', 'cantidad', function () {
    let precio = this.get('producto.precio');
		if(!isBlank(precio)) {
        let total = precio.get('value') * this.get('cantidad');
        return total
	  }
		else
			return 0
    }).meta({ serialize: true })
});
