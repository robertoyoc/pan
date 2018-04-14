import FirebaseAdapter from 'emberfire/adapters/firebase';
import { inject as service } from "@ember/service";

export default FirebaseAdapter.extend({
	currentUser: service(),
	session: service(),
	store: service(),

 	async pathForType(modelName){
		let path = this._super(...arguments);

		

		if(modelName == 'sucursal'){
			return path;
		}

		if(modelName == 'user'){
			return path;
		}
		debugger
		return this.get('store').findAll('user').then((user)=>{
			console.log(user)
			return `sucursals/-L88RKW9sV0BENxKIzcG/${path}`
		})

		// console.log(this.get('currentUser.model'))
		// debugger
		// return `sucursals/-L88RKW9sV0BENxKIzcG/${path}`
		// console.log(sucursal)
		// debugger
		// return `sucursals/${sucursal}/${path}`;

		// let account = this.get('currentUser.model').then(()=>{
		// 	debugger
		// })
		// debugger
		// let accountSuc = this.get('currentUser.model.sucursal')
		// debugger
		// console.log(account)
		// debugger
		// console.log(accountSuc)
		// debugger
		// // console.log(account.get('sucursal'))
		// debugger
		// return `sucursals/-L88RKW9sV0BENxKIzcG/${path}`;

		
		

	}
});
