import Route from '@ember/routing/route';
import AuthenticatedRoute from '../mixins/authenticated-route';
import { inject as service } from '@ember/service';



export default Route.extend(AuthenticatedRoute, {
	currentUser: service(),
	beforeModel(transition){
		this._super(...arguments)
		return this.get('session').fetch().catch(()=>{
			return this.get('currentUser.account').then((account)=>{
				if(account.get('perfil')!='dueno'){
					transition.abort()
					return this.transitionTo(account.get('perfil'))
				}
			})
		})
	}
});
