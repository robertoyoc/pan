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
        guardar(cajero, sucursal, isNew){
            if(isEmpty(sucursal.get('cajerosId')))
                sucursal.set('cajerosId', []);

            cajero.set('sucursal', sucursal);

            if(isNew){
                //console.log('Nuevo')
                this.get('firebase').auth().createUserWithEmailAndPassword(this.get('halfmail') + "@panlavillita.mx", this.get('password')).then((newUser)=>{
                    cajero.set('uid', newUser.uid);
                    console.log(sucursal.get('cajerosId'))
                    sucursal.get('cajerosId').push(cajero.get('id'))
                    cajero.save().then(()=>{
                        this.sendAction('saveCajero')
                    })
                })
            } else {
                //console.log('Editado')
                cajero.save().then(()=>{
                    this.sendAction('saveCajero')
                })
            }
        }
    }
});
