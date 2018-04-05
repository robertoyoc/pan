import Component from '@ember/component';

export default Component.extend({
    actions: {
        guardar(mprima, existencia){
		    mprima.get('existencias').pushObject(existencia)
		    existencia.save().then(()=>{
		        mprima.save().then(()=>{
		 	        window.swal(
	  		            'Materia Prima Añadida',
			            'Añadiste nueva materia prima',
			            'success'
			        ).then(()=>{
					    this.sendAction('nuevoMprima')
				    })
			    })
            })	
        }
    }
});
