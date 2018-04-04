import DS from 'ember-data';
import Producto from './producto';


export default Producto.extend({
	ingredientes: DS.hasMany('mprima'),
	imageUrl: DS.attr('string')

});
