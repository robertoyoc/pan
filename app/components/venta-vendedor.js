import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from "@ember/service";
import { all } from 'rsvp';

export default Component.extend({
    disabledVender: computed('myModel', function() {
		return this.get('myModel.pedidos.length') > 0;
    }),

    actions: {
        delete(pedido){
			pedido.destroyRecord()
        }, 

        finalizar(venta){
			all(venta.get('pedidos').invoke('save')).then(()=>{
				venta.save().then(()=>{
                    this.sendAction('nuevaVenta');
                })
            })
		}, 
    }
});
