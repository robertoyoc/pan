import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DataRoute from 'ember-data-route';

export default Route.extend(DataRoute, {
  currentUser: service(),
  model() {
    return this.get('currentUser.account').then((account) => {
      return account.get('cajeroDe').then((sucursal)=>{
        return this.store.createRecord('cobro', {
          sucursal: sucursal
        })
      })
    })
  }
});
