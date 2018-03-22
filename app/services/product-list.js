import { Promise as EmberPromise } from 'rsvp';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import Service, { inject as service } from '@ember/service';
import DS from "ember-data"

export default Service.extend({

	store: service(),




	productos: computed({
		get() {
             let productosList = [];
             debugger
              
             return DS.PromiseObject.create({

                promise: this.get('store').findAll('distribuido').then((distribuidos)=>{
                        return this.get('store').findAll('receta').then((recetas)=>{ 
                            distribuidos.forEach((distribuido)=>{
                                productosList.pushObject(distribuido)
                            })
                            recetas.forEach((receta)=>{
                                productosList.pushObject(receta)
                            })
                            return productosList;    
                        })
                    })
             })
                    
		} 
			
    })
});