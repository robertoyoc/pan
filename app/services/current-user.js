import { Promise as EmberPromise } from 'rsvp';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import Service, { inject as service } from '@ember/service';

export default Service.extend({
	session: service(),
	store: service(),
	_account: "hola",

	isAuthenticated: alias('session.isAuthenticated'),

	account: computed('isAuthenticated', '_account', {
		get() {
			return this.get('session').fetch().catch(()=>{
			}).then(()=>{
				if (this.get('isAuthenticated')) {
					//this._retreiveAccount()
					//devolver cuenta

					return this.get('store').query('account', {
						orderBy: 'uid',
						equalTo: this.get('session.currentUser.uid'),
						limitToLast: 1
					}).then((account) => {
						let _account = account.get('firstObject');
						return _account;
					});
				} 
				else {
				this.set('_account', null)
				return null
				}
			});
		
		} 
			
	}),



	

	// init() {
	//   this.loadAccount();

	// },

	// _retreiveAccount() {
	//   return this.get('store').query('account', {
	//     orderBy: 'uid',
	//     equalTo: this.get('session.currentUser.uid'),
	//     limitToLast: 1
	//   }).then((account) => {
	//     this.set('_account', account.get('firstObject'));
	//     return this.get('_account');
	//   });
	// },

	// loadAccount() {
	//   if (this.get('isLoading')) {
	//     return;
	//   }
	//   return new EmberPromise((resolve, reject) => {
	//     this.get('isLoading', true);

	//     let callback = () => {
	//       if (this.get('isAuthenticated')) {
	//         return this._retreiveAccount().then((account) => {
	//           if(!account){  return reject(); }
	//           return resolve(account);
	//         }).catch(() => {
	//           return reject();
	//         });
	//       } else {
	//         return reject();
	//       }
	//     }

	//     this.get('session').fetch().catch(() => {}).then(callback);
	//   }).catch(() => {
	//     this.get('isLoading', false);
	//   }).then(() => {
	//     this.get('isLoading', false);
	//     return this.get('_account');
	//   });
	//}
});
