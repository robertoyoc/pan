import Controller from '@ember/controller';

export default Controller.extend({
  actions:{
      saveAdministrador(){
          this.transitionToRoute('dueno.administradores')
      }
  }
});
