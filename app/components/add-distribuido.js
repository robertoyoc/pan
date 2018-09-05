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

  cantExistencia: computed(function(){
  	if (this.get('myExistencia.cantidad') > 0) {
  		return this.get('myExistencia.cantidad')
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

          precio.get('distribuidos').then((listaDistribuidos)=>{
            listaDistribuidos.pushObject(producto)
            listaDistribuidos.save().then(()=>{
              precio.save().then(()=>{

                categoria.get('distribuidos').then((distribuidosList)=>{
                  distribuidosList.pushObject(producto)
                  distribuidosList.save().then(()=>{
                    categoria.save().then(()=>{

                      if(isNew) {
                        return all(
                            sucursales.map((listedSucursal)=>{
                              if(listedSucursal.get('id') != sucursal.get('id')) {
                                return listedSucursal.get('existencias').then((existenciasList)=>{

                                  let existenceRecord = this.get('store').createRecord('existence', {
                                    tipo: 'distribuido',
                                    cantidad: 0,
                                    sucursal: listedSucursal,
                                    distribuido: producto
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
                                      'Distribuido Guardado',
                                      'Añadiste producto distribuido',
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
                                    'Distribuido Guardado',
                                    'Actualizaste producto distribuido',
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
	 			var path = 'images/distribuidos/' + this.get('myModel.id') + '.png';
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
						// ctrl.set(document.getElementById('output').src, '');
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
