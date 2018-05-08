import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  currentUser: service(),
  model() {
    return this.get('currentUser.account').then((account) => {
      this.set('sucursalId', account.get('sucursal.id'))
      return this.store.createRecord('cobro', {
        sucursalId: account.get('sucursal.id')
      })

    })

  },
  setupController(controller) {
    this._super(...arguments)
    controller.set('sucursalId', this.get('sucursalId'))

  }
});
