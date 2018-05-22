import Component from '@ember/component';
import { computed } from "@ember/object";
import { inject as service } from "@ember/service";
import { isEmpty } from '@ember/utils';


export default Component.extend({
    store: service(),
    session: service(),
	firebase: service('firebaseApp'),

    newUser: computed('model', function(){
        return isEmpty(this.get('model.uid'))
    }),

    sucursales: computed(function(){
        return this.get('store').findAll('sucursal')
    }),

    actions: {
        guardar(vendedor, sucursal, isNew){
            if(isEmpty(sucursal.get('vendedoresId')))
                sucursal.set('vendedoresId', []);

            vendedor.set('sucursal', sucursal);

            if(isNew){
                //console.log('Nuevo')
                this.get('firebase').auth().createUserWithEmailAndPassword(this.get('halfmail') + "@panlavillita.mx", this.get('password')).then((newUser)=>{
                    vendedor.set('uid', newUser.uid);
                    //console.log(sucursal.get('vendedoresId'))
                    sucursal.get('vendedoresId').push(vendedor.get('id'))
                    vendedor.save().then(()=>{
                        this.sendAction('saveVendedor')
                    })
                })
            } else {
                //console.log('Editado')
                vendedor.save().then(()=>{
                    this.sendAction('saveVendedor')
                })
            }
        }
    }
});
