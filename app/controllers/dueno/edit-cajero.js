import Controller from '@ember/controller';

export default Controller.extend({
    actions:{
        saveCajero(){
            this.transitionToRoute('dueno.cajeros')
        }
    }
});
