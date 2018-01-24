import Controller from '@ember/controller';

export default Controller.extend({
	actions: {
		guardar(mprima){
			mprima.save().then(()=>{
				window.swal(
  				  'Materia Prima Añadida',
				  'Añadiste nueva materia prima',
				  'success'
				).then(()=>{
					this.transitionToRoute('admin.lista-mprima')
				})
			})
		}
	}



});
