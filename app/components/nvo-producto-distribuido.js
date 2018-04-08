import Component from '@ember/component';
import { inject as service } from "@ember/service";
import { computed } from '@ember/object';

export default Component.extend({
    store: service(),
	firebaseApp: service(),
	
	myCategorias: computed(function() {
		return this.get('store').findAll('categoria')
    }),

// mprima.get('existencias').pushObject(existencia)
// 		    existencia.save().then(()=>{
// 		        mprima.save().then(()=>{
// 		 	        window.swal(
// 	  		            'Materia Prima Añadida',
// 			            'Añadiste nueva materia prima',
// 			            'success'
// 			        ).then(()=>{
// 					    this.sendAction('nuevoMprima')
// 				    })
// 			    })
//             })	


	actions: {
		guardar(producto, existencia) {
			existencia.save().then(()=>{
				producto.save().then(()=>{
					window.swal(
 	  		            'Distribuido Guardado',
		            	'Guardaste un producto distribuido',
			            'success'
		        	).then(()=>{
						this.sendAction('nuevoProducto');
					})
				})
			})	
        },
        
		didSelectImage(files){
			let ctrl = this;
			let reader = new FileReader();
			reader.onloadend = Ember.run.bind(this, function(){
				var dataURL = reader.result;
				var output = document.getElementById('output');
				output.src = dataURL;
				this.set('file', files[0]);
				var metadata = {
	 				contentType: 'image/png'
	 			};
				var storageRef = this.get('firebaseApp').storage().ref();
	 			var path = 'images/distribuidos/' + this.get('model.id') + '.png';
	 			var uploadTask = storageRef.child(path).put(this.get('file'), metadata);
	 			uploadTask.on('state_changed', function(snapshot){
				var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					console.log('Upload is ' + progress + '% done');
					console.log(snapshot.state);
				}, function(error) {
				}, function() {
	 				var downloadURL = uploadTask.snapshot.downloadURL;
	 				ctrl.get('myModel').set('imageUrl', downloadURL);
	 				ctrl.get('myModel').save()
	 				ctrl.set('file', '');
	 				ctrl.set('selectedCategory', '');
	 				ctrl.set(document.getElementById('output').src, '');
	 				ctrl.set('days', '');
	 				ctrl.set('isDisabled', true);
	 			});
			})
			//debugger;
			reader.readAsDataURL(files[0]);
 			console.log(this.get('file'))
			
 		}
	}
});
