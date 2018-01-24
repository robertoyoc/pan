import Route from '@ember/routing/route';
import { inject as service } from "@ember/service" 

export default Route.extend({
	session: service(),
	currentUser: service(),
	beforeModel(transition){
		this.get('session').fetch().catch(()=>{
        	
            if(!this.get('session.currentUser.uid')){
            	
                transition.abort()
                this.transitionTo('index')

            }
            else{
            	this.get('currentUser.account').then((account)=>{
            		transition.abort()
            		this.transitionTo(account.get('perfil'))
            	})
            }
        })
	}
});
