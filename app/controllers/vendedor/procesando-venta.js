import Controller from '@ember/controller';
import {inject as service} from "@ember/service";

export default Controller.extend({
	currentUser: service(),

    actions: {
      nuevaVenta(){
      	this.transitionToRoute('vendedor.index');
      },
			// TRANSICIONES
      processVenta(venta){
          this.transitionToRoute('vendedor.venta', venta.id);
      },
		}
});
