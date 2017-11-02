import Ember from 'ember';

export default Ember.Mixin.create({
  session: Ember.inject.service(),
  store: Ember.inject.service(),
  beforeModel(transition){
    let route =this;
    this.get('session').fetch().then(function(){

    return route.get('store').query('account', {
      orderBy: 'user',
      equalTo: route.get('session.currentUser.uid'),
      limitToLast: 1
    }).then((account)=>{
      console.log(account)
      console.log(account.get('firstObject').data.perfil)
    })



    }).catch(function(){ //ya estaba autenticado o no hay session
      if(!route.get('session.currentUser')){
        transition.abort();
        route.transitionTo('login');
      }
    });
  }
});
