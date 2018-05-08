import Route from '@ember/routing/route';
import { hash } from 'rsvp';

export default Route.extend({
  model(params) {
      return hash({
                venta: this.store.createRecord('venta'),
                cortesia: this.store.peekRecord('courtesy', params.id)
          });
      }
  });
