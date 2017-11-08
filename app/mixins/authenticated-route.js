import { inject as service } from '@ember/service';
import Mixin from '@ember/object/mixin';

export default Mixin.create({
  session: service(),
  store: service(),
  beforeModel(transition){
    let route =this;
    this.get('session').fetch().then(function(){
    }).catch(function(){ //ya estaba autenticado o no hay session
      if(!route.get('session.currentUser')){
        transition.abort();
        route.transitionTo('login');
      }
    });
  }
});
