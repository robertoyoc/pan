import Route from '@ember/routing/route';
import {hash} from 'rsvp';
import {inject as service} from "@ember/service";

export default Route.extend({
    currentUser: service(),
    model(){
		  return this.store.createRecord('receta');
    },

    afterModel(model){
		  return this.get('currentUser.account').then((account)=>{
        return this.set('existencia', this.store.createRecord('existence',{
         receta: model,
         tipo: model.get('constructor.modelName'),
         sucursal: account.get('administradorDe'),
       }))
		  })
    },

    setupController(controller){
      this._super(...arguments)
      controller.set('existencia', this.get('existencia'))
	  }
});
