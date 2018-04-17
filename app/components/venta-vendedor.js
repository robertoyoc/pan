import Component from '@ember/component';
import { computed } from '@ember/object';
import moment from 'moment';
import { inject as service } from "@ember/service";
import { all } from 'rsvp';

export default Component.extend({
    store: service(),

    month: moment().format('MM'),
    day: moment().format('DD'),
    year: moment().format('YYYY'),

    myCategorias: computed(function() {
        return this.get('store').findAll('categoria')
    }),

    disabledVender: computed('myModel', function() {
		return this.get('myModel.pedidos.length') > 0;
    }),

    actions: {
        delete(pedido){
			pedido.destroyRecord()
        }, 

        finalizar(venta){
            venta.set('fecha', moment().format())
			all(venta.get('pedidos').invoke('save')).then(()=>{
				venta.save().then(()=>{
                    this.sendAction('nuevaVenta', venta);
                })
            })
		}, 
    }
});
