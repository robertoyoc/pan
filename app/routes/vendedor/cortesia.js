import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
    model(params) {
        this.set('cortesia_id', params.id)
        return this.store.peekRecord('courtesy', params.id).get('pedidos').createRecord();   
    },

    setupController(controller){
        this._super(...arguments)
        controller.set('cortesia_id', this.get('cortesia_id'))
    }

});
