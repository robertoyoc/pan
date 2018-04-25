import Controller from '@ember/controller';
import { computed } from '@ember/object';
import moment from 'moment';
import FindQuery from 'ember-emberfire-find-query/mixins/find-query';

export default Controller.extend(FindQuery, {
	result: null,
	names: ['Efectivo', 'Tarjeta Debito/Credito', 'Cheque',],

	selectedVenta: computed('result', function(){
		if(this.get('result'))
		{
			//console.log(this.get('result'))
			let venta = this.store.findRecord('venta', this.get('result'))
			//console.log(venta)
			if(!venta.get('fechaPago')){
				return venta;
			} else {
				return null;
			}
		} else {
			return null;
		}
	}),

	disabledPagar: computed('pagoCliente', 'selectedVenta', function() {
		return Number(this.get('pagoCliente')) >= Number(this.get('selectedVenta.importeTotal'));
    }),

	cambioCliente: computed('pagoCliente', 'selectedVenta', function(){
		if(this.get('selectedVenta.importeTotal')){
			if (Number(this.get('pagoCliente')) >= Number(this.get('selectedVenta.importeTotal')))
				return Number(this.get('pagoCliente')) - Number(this.get('selectedVenta.importeTotal'))
			else
				return 0
		} else {
			return 0;
		}
	}),

	actions: {
		realizarPago(venta){
			venta.set('fechaPago', moment().format())
			this.set('result', null);
		}
	}
});
