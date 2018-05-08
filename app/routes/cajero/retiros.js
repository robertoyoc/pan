import Route from '@ember/routing/route';
import FindQuery from 'ember-emberfire-find-query/mixins/find-query';
import { inject as service } from "@ember/service";
import moment from 'moment';



export default Route.extend(FindQuery, {
  currentUser: service(),
  beforeModel() {

  },
  model() {
    return this.get('currentUser.account').then((account) => {
      this.set('accountId', account.get('id'))
      let sucursal = account.get('sucursal');
      this.set('sucursalId', sucursal.get('id'))

      let context = this;
      // debugger
      return new Promise(function(resolve, reject) {
        // debugger
        context.filterEqual(context.store, 'retiro', { 'fechaShort': "8 May, 2018", 'sucursalId': sucursal.get('id') }, function(recetas) {
          // console.log(recetas)
          return resolve(recetas)

        })
      })
    })


  },
  setupController(controller) {
    this._super(...arguments)
    controller.set('sucursalId', this.get('sucursalId'))
    controller.set('accountId', this.get('accountId'))

  }
});
