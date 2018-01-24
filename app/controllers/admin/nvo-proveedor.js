import Controller from '@ember/controller';
import { computed } from "@ember/object"


const dias = ["Lunes", "Martes"]

export default Controller.extend({
	dias,
	disabledInput: computed('radioSelect', function () {
		if(this.get('radioSelect')=='otro')
			return false
		else
			return true
	}),
	actions: {
		mutRadio(texto){
			this.set('radioSelect', texto)
		},
		guardar(proveedor){
			proveedor.save()
		}, 

		debug(){
			debugger
		}
	}
});
