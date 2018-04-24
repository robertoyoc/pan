import Controller from '@ember/controller';
import { computed } from '@ember/object';

import FindQuery from 'ember-emberfire-find-query/mixins/find-query';

export default Controller.extend(FindQuery, {
	names: ['Efectivo', 'Tarjeta Debito/Credito', 'Cheque',],

	selectedVenta: computed('result', function(){
		if(this.get('result'))
		{
			console.log(this.get('result'))
			let venta = this.store.findRecord('venta', this.get('result'))
			console.log(venta)
			if(!venta.get('fechaPago')){
				return venta;
			} else {
				return null;
			}
		} else {
			return null;
		}
	}),

	cambioCliente: computed('pagoCliente', 'selectedVenta', function(){
		if(this.get('selectedVenta.importeTotal')){
			return Number(this.get('pagoCliente')) - Number(this.get('selectedVenta.importeTotal'))
		} else {
			return 0;
		}
	})
});
