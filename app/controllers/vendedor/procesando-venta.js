import Controller from '@ember/controller';

export default Controller.extend({
    actions: {
        nuevaVenta(venta){
            venta.set('sucursal', this.get('selectedSucursal'))
            this.transitionToRoute('vendedor.index');
        }
    }
});
