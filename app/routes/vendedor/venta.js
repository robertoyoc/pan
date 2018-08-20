import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
    model(params) {
        this.set('venta_id', params.idventa)
        return this.store.findRecord('venta', params.idventa).then((venta)=>{
          return venta.get('pedidos').createRecord({
              venta: venta
            });
        });
    },

    setupController(controller){
        this._super(...arguments)
        controller.set('venta_id', this.get('venta_id'))
    }
});
