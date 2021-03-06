import Component from '@ember/component';
import { inject as service } from "@ember/service";
import { computed } from '@ember/object';
import { isBlank } from '@ember/utils';
import { all } from 'rsvp';

export default Component.extend({
    store: service(),
    firebaseApp: service(),

  	myCategorias: computed(function() {
  		return this.get('store').findAll('categoria')
  	}),
    myPrices: computed(function() {
      return this.get('store').findAll('price')
    }),
    mySucursales: computed(function() {
    	return this.get('store').findAll('sucursal')
    }),


  	listMprimas: computed(function() {
  		return this.get('store').findAll('mprima')
    }),

  	cantExistencia: computed(function(){
      	if (this.get('existencia.cantidad') > 0) {
      		return this.get('existencia.cantidad')
      	} else {
      		return 1;
     		}
      }),

	actions: {
    guardar(producto, existencia, precio, categoria, sucursal, sucursales, isNew) {

      if(!isBlank(categoria)){
        if(!isBlank(precio)){

          producto.set('categoria', categoria);
          producto.set('precio', precio);

          precio.get('recetas').then((listaRecetas)=>{
            listaRecetas.pushObject(producto)
            listaRecetas.save().then(()=>{
              precio.save().then(()=>{

                categoria.get('recetas').then((recetasList)=>{
                  recetasList.pushObject(producto)
                  recetasList.save().then(()=>{
                    categoria.save().then(()=>{

                      if(isNew) {
                        return all(
                            sucursales.map((listedSucursal)=>{
                              if(listedSucursal.get('id') != sucursal.get('id')) {
                                return listedSucursal.get('existencias').then((existenciasList)=>{

                                  let existenceRecord = this.get('store').createRecord('existence', {
                                    tipo: 'receta',
                                    cantidad: 0,
                                    sucursal: listedSucursal,
                                    receta: producto
                            			});

                                  return existenceRecord.save().then(()=>{
                                    existenciasList.pushObject(existenceRecord);
                                    return existenciasList.save().then(()=>{
                                      return listedSucursal.save();
                                    })
                                  })
                                });
                              }
                            })
                        ).then(()=>{

                          sucursal.get('existencias').then((existenciasList)=>{
                            existenciasList.pushObject(existencia)
                            existenciasList.save().then(()=>{
                              sucursal.save().then(()=>{

                                existencia.set('cantidad', this.get('cantExistencia'))
                                existencia.save().then(()=>{
                                  producto.set('categoria', categoria)
                                  producto.save().then(()=>{
                                    window.swal(
                                      'Receta Guardada',
                                      'Añadiste producto receta',
                                      'success'
                                    ).then(()=>{
                                    this.sendAction('nuevoProducto');
                                    })
                                  })
                                })

                              })
                            })
                          })

                        });
                      } else {
                        sucursal.get('existencias').then((existenciasList)=>{
                          existenciasList.pushObject(existencia)
                          existenciasList.save().then(()=>{
                            sucursal.save().then(()=>{

                              existencia.set('cantidad', this.get('cantExistencia'))
                              existencia.save().then(()=>{
                                producto.set('categoria', categoria)
                                producto.save().then(()=>{
                                  window.swal(
                                    'Receta Guardada',
                                    'Actualizaste producto receta',
                                    'success'
                                  ).then(()=>{
                                  this.sendAction('nuevoProducto');
                                  })
                                })
                              })

                            })
                          })
                        })
                      }

                    })
                  })
                })

              })
            })
          })

        } else {
          window.swal(
            'Error',
            'Selecciona el precio',
            'error'
          )
        }
      } else {
        window.swal(
          'Error',
          'Selecciona una categoría',
          'error'
        )
      }
    },

    didSelectImage(files){
			let ctrl = this;
			let reader = new FileReader();
			reader.onloadend = Ember.run.bind(this, function(){
				var dataURL = reader.result;
				var output = document.getElementById('output');
				// output.src = dataURL;
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
	 				ctrl.get('model').set('imageUrl', downloadURL);
	 				ctrl.get('model').save()
	 				ctrl.set('file', '');
	 				ctrl.set('selectedCategory', '');
	 				// ctrl.set(document.getElementById('output').src, '');
	 				ctrl.set('days', '');
	 				ctrl.set('isDisabled', true);
	 			});
			})
			//debugger;
			reader.readAsDataURL(files[0]);
 			console.log(this.get('file'))
 		},

 		changePrima() {
      this.set('selectedProducto', undefined)
    },

    agregar(mprima){
			this.get('model.ingredientes').pushObject(mprima)
			all(this.get('model.ingredientes').invoke('save'))
			this.sendAction('changePrima')
		},

		delete(mprima){
			mprima.destroyRecord()
		}

  }
});
