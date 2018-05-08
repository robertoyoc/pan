import Controller from '@ember/controller';
import {inject as service} from "@ember/service";

export default Controller.extend({
	currentUser: service(),

    actions: {
        nuevaVenta(venta){
        	this.get('currentUser.account').then((account)=>{
        		account.get('sucursal').then((sucursal)=>{
        			venta.set('propietario', account);
        			venta.set('sucursal', sucursal);
        			venta.save().then(()=>{
        				this.transitionToRoute('vendedor.index');
        			})
        		})

        	})
        }
    }
});
