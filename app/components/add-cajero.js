import Component from '@ember/component';
import { computed } from "@ember/object";
import { inject as service } from "@ember/service";
import { isEmpty } from '@ember/utils';
import QRCode from 'qrcode';

export default Component.extend({
    store: service(),
    session: service(),
  	firebaseApp: service(),

    newUser: computed('model', function(){
        return isEmpty(this.get('model.uid'))
    }),

    sucursales: computed(function(){
        return this.get('store').findAll('sucursal')
    }),

    actions: {
        guardar(cajero, sucursal, isNew){
          let ctx = this;
            if(isEmpty(sucursal.get('cajerosId')))
                sucursal.set('cajerosId', []);

            cajero.set('sucursal', sucursal);

            if(isEmpty(cajero.get('qrCode'))){
              var opts = {
                type: 'image/png',
                rendererOpts: {
                  quality: 0.99
                }
              }

              QRCode.toDataURL(cajero.get('id'), opts, function (err, url) {
                  if (err) throw err
                  cajero.set('qrCode', url)
              })
            }

            if(isNew){

              //console.log('Nuevo')
              this.get('firebaseApp').auth().createUserWithEmailAndPassword(this.get('halfmail') + "@panlavillita.mx", this.get('password')).then((newUser)=>{
                  cajero.set('uid', newUser.uid);
                  //console.log(sucursal.get('cajerosId'))
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
        },
    }
});
