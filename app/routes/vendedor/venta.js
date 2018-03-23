import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
    productList: service(),

    beforeModel() {
       
    },

    model(params) {

        this.set('venta_id', params.idventa)

        return this.store.peekRecord('venta', params.idventa).get('pedidos').createRecord();   
        /*
            return this.store.peekRecord('venta', params.idventa).then((venta)=>{
                console.log(venta)
                return venta.get('pedidos').createRecord();
            })
        */
    },

    setupController(controller){
        this._super(...arguments)
        controller.set('venta_id', this.get('venta_id'))
    }

});
