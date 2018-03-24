import Service from '@ember/service';
import { inject as service } from "@ember/service";


const references = {
	'producto': "productos",
	'pedido': "pedidos"

}

export default Service.extend({
	currentUser: service(),
	store: service(),
	findAllWithPath(modelName){
		return this.get('currentUser.account').then((account)=>{
			let sucursal = account.get('sucursal.id')
			return this.get('store').query(modelName, {
		    	path: `sucursals/${sucursal}/${references[modelName]}`,
		  	})
		})
	}
});
