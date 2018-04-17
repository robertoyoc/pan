import Component from '@ember/component';
import { computed } from "@ember/object";

import { inject as service } from "@ember/service";

export default Component.extend({
	store: service(),

    actions: {
        guardar(mprima, existencia){
		    mprima.get('existencias').pushObject(existencia)
		    existencia.save().then(()=>{
		        mprima.save().then(()=>{
		 	        window.swal(
	  		            'Materia Prima Añadida',
			            'Guardaste materia prima',
			            'success'
			        ).then(()=>{
					    this.sendAction('nuevoMprima')
				    })
			    })
            })	
        }
    }
});
