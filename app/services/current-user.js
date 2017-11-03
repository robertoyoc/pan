import Ember from 'ember';

export default Ember.Service.extend({
  session: Ember.inject.service(),
  store: Ember.inject.service(),
  _account: null,

  isAuthenticated: Ember.computed.alias('session.isAuthenticated'),

  account: Ember.computed('isAuthenticated', '_account', {
    get() {
      if (this.get('isAuthenticated')) {
        this._retreiveAccount()
      } else {
        this.set('_account', null)
      }
      return this.get('_account');
    }
  }),

  init() {
    this.loadAccount();
  },

  _retreiveAccount() {
    return this.get('store').query('account', {
      orderBy: 'user',
      equalTo: this.get('session.currentUser.uid'),
      limitToLast: 1
    }).then((account) => {
      this.set('_account', account.get('firstObject'));
      return this.get('_account');
    });
  },

  loadAccount() {
    if (this.get('isLoading')) {
      return;
    }
    return new Ember.RSVP.Promise((resolve, reject) => {
      this.get('isLoading', true);

      let callback = () => {
        if (this.get('isAuthenticated')) {
          return this._retreiveAccount().then((account) => {
            if(!account){  return reject(); }
            return resolve(account);
          }).catch(() => {
            return reject();
          });
        } else {
          return reject();
        }
      }

      this.get('session').fetch().catch(() => {}).then(callback);
    }).catch(() => {
      this.get('isLoading', false);
    }).then(() => {
      this.get('isLoading', false);
      return this.get('_account');
    })
  }
});
