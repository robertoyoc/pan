import Route from '@ember/routing/route';
import { hash } from 'rsvp';

export default Route.extend({
    model(params) {
        // return hash({
        //           venta: this.store.peekRecord('venta', params.idventa),
        //           cortesia: this.store.createRecord('courtesy')
        //     });
        // }
            return this.store.peekRecord('venta', params.idventa)
        }
    });
