import Controller from '@ember/controller';

export default Controller.extend({
    actions:{
        saveVendedor(){
            this.transitionToRoute('dueno.vendedores')
        }
    }
});
