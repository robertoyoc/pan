import Route from '@ember/routing/route';
import FindQuery from 'ember-emberfire-find-query/mixins/find-query';
import { inject as service } from "@ember/service";
import moment from 'moment';

export default Route.extend(FindQuery, {
  currentUser: service(),
  beforeModel() {

  },
  model() {
    return this.store.findAll('retiro')
  },

  setupController(controller) {
    this._super(...arguments)
    controller.set('sucursalId', this.get('sucursalId'))
    controller.set('accountId', this.get('accountId'))

  }
});
