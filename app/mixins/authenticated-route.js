import { inject as service } from '@ember/service';
import Mixin from '@ember/object/mixin';

export default Mixin.create({
    session: service(),
    beforeModel(transition){
        return this.get('session').fetch().catch(()=>{
            if(!this.get('session.currentUser.uid')){

                transition.abort()
                this.transitionTo('index')
            }
        })
    } 
});
