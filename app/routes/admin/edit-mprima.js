import Route from '@ember/routing/route';
import {hash} from 'rsvp';
import {inject as service} from "@ember/service";

export default Route.extend({
	currentUser: service(),
	model(params){
		return this.store.findRecord('mprima', params.id)
	},
	afterModel(model){
		return this.get('currentUser.account').then((account)=>{
            return model.get('existencias').then((existencias)=>{
                let globalExistencia = null
                existencias.forEach((existencia)=>{
                    if(existencia.get('sucursal.id')==account.get('sucursal.id'))
                        globalExistencia = existencia
                })
                return this.set('existencia', globalExistencia)
            })
		})
	},
	setupController(controller){
		this._super(...arguments)
		controller.set('existencia', this.get('existencia'))
	}
});
