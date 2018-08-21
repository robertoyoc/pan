import { computed } from '@ember/object';
import DS from 'ember-data';

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
		if(this.get('producto.precio')) {
			let total = this.get('producto.precio') * this.get('cantidad')
	    	return total
	  }
		else
			return 0
    }).meta({ serialize: true })
});
