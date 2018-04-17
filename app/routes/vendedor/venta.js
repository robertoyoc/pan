import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
    //productList: service(),
 
    beforeModel() {
        // this.store.createRecord('categoria', {
        //     nombre: 'Bocadillos'
        // }).save()
        // this.store.createRecord('categoria', {
        //     nombre: 'Charcuteria'
        // }).save()
        // this.store.createRecord('categoria', {
        //     nombre: 'Feité' 
        // }).save()
        // this.store.createRecord('categoria', {
        //     nombre: 'Galletas'
        // }).save()
        // this.store.createRecord('categoria', {
        //     nombre: 'Lácteos'
        // }).save()
        // this.store.createRecord('categoria', {
        //     nombre: 'Pan Dulce'
        // }).save()
        // this.store.createRecord('categoria', {
        //     nombre: 'Pan Sal'
        // }).save()
        // this.store.createRecord('categoria', {
        //     nombre: 'Panqué'
        // }).save()
        // this.store.createRecord('categoria', {
        //     nombre: 'Pasteles'
        // }).save()
    },

    model(params) {
        this.set('venta_id', params.idventa)
        return this.store.peekRecord('venta', params.idventa).get('pedidos').createRecord();   
    },

    setupController(controller){
        this._super(...arguments)
        controller.set('venta_id', this.get('venta_id'))
    }

});
