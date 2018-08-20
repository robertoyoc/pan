import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import {inject as service} from "@ember/service";
import DataRoute from 'ember-data-route';

export default Route.extend(DataRoute, {
  	currentUser: service(),

    model() {
      return this.get('currentUser.account').then((account)=>{
        	return account.get('vendedorDe').then((sucursal)=>{
        		  return this.store.createRecord('venta', {
		              	propietario: account,
		              	sucursal: sucursal
		          })
        	})
      })
    }

});
