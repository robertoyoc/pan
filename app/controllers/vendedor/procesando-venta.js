import Controller from '@ember/controller';

export default Controller.extend({
    actions: {
        nuevaVenta(){
            this.transitionToRoute('vendedor.index');
        }
    }
});
