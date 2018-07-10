import Route from '@ember/routing/route';
import { inject as service } from "@ember/service"

export default Route.extend({
	session: service(),
	currentUser: service(),

	beforeModel(transition){      
        return this.get('session').fetch().catch(()=>{
            if(this.get('session.currentUser.uid')){
            	return this.get('currentUser.account').then((account)=>{
            		transition.abort()
                	return this.transitionTo(account.get('perfil'))
            	})
            }
        }).then(()=>{
        	if(this.get('session.currentUser.uid')){
            	return this.get('currentUser.account').then((account)=>{
            		transition.abort()
                	return this.transitionTo(account.get('perfil'))
            	})
            }
        })
    }
});
