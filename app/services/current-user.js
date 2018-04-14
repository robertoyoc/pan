import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import Service, { inject as service } from '@ember/service';
import DS from 'ember-data';

export default Service.extend({
  session: service(),
  store: service(),

  tokenDecoded: null,

  raw: alias('session.currentUser'),
  id: alias('model.id'),

  model: computed('session.currentUser.uid', function() {
    let uid = this.get('session.currentUser.uid');

    if (uid) {
      return DS.PromiseObject.create({
        promise: this.get('store').findRecord('user', uid).then((user) => {
          return user
        }).catch(() => {
          
          return null;
        })
      });
    }
  }),
  /**
   * @override: ember lifecycle
   */
  init(...params) {
    this._super(...params);
    this.get('session.currentUser.uid');
    this.get('model');
  }
});