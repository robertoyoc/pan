import { computed } from '@ember/object';
import DS from 'ember-data';

export default DS.Model.extend({
	//producto: DS.belongsTo('producto'),
  	cart: DS.belongsTo('cart'),
  	cantidad: DS.attr('number'),
  	
  	tipo: DS.attr('string'),
	  productoId: DS.attr('string'),
	  producto: computed('tipo', 'productoId', function(){
      if(this.get('tipo'))
		    return this.store.findRecord(this.get('tipo'), this.get('productoId'))
      else return null
	  }),

    total: computed('producto.precio', 'cantidad', function () {
      return this.get('producto.precio') * this.get('cantidad')
    }).meta({ serialize: true }),

});
