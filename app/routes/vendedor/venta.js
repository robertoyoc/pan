import Route from '@ember/routing/route';

export default Route.extend({
    beforeModel() {
       
    },

    model(params) {
        this.set('venta_id', params.idventa)

        let myVenta = this.store.peekRecord('venta', params.idventa);
        
        return myVenta.get('pedidos').createRecord();

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
