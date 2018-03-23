import Component from '@ember/component';
import { inject as service } from "@ember/service";
import { all } from 'rsvp';

export default Component.extend({
    
    actions: {
        delete(pedido){
			pedido.destroyRecord()
        }, 

        finalizar(venta){
			all(venta.get('pedidos').invoke('save')).then(()=>{
				venta.save();
                this.sendAction('nuevaVenta');
			})
		}, 
    }
});
