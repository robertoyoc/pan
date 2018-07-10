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
        guardar(administrador, sucursal, isNew){
          let ctx = this;

            administrador.set('administradorDe', sucursal);

            if(isEmpty(administrador.get('qrCode'))){
              var opts = {
                type: 'image/png',
                rendererOpts: {
                  quality: 0.99
                }
              }

              QRCode.toDataURL(administrador.get('id'), opts, function (err, url) {
                  if (err) throw err
                  administrador.set('qrCode', url)
              })
            }

            if(isNew){
              //console.log('Nuevo')
              this.get('firebaseApp').auth().createUserWithEmailAndPassword(this.get('halfmail') + "@panlavillita.mx", this.get('password')).then((newUser)=>{
                  administrador.set('uid', newUser.uid);
                  //console.log(sucursal.get('cajerosId'))
                  administrador.save().then(()=>{
                    sucursal.get('administradores').then((administradoresList)=>{
                      administradoresList.pushObject(administrador)
                      administradoresList.save().then(()=>{
                        sucursal.save().then(()=>{
                          this.sendAction('saveAdministrador')
                        })
                      })
                    })
                  })
              })
            } else {
                //console.log('Editado')
                this.get('sucursal').then((newSucursal)=>{
                  administrador.save().then(()=>{
                    newSucursal.get('administradores').then((administradoresList)=>{
                      administradoresList.pushObject(administrador)
                      administradoresList.save().then(()=>{
                        newSucursal.save().then(()=>{
                          this.sendAction('saveAdministrador')
                        })
                      })
                    })
                  })
                })
            }
        },
    }
});
