import Component from '@ember/component';
import { computed } from "@ember/object";
import { inject as service } from "@ember/service";
import { isEmpty } from '@ember/utils';
import QRCode from 'qrcode';

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
            vendedor.set('vendedorDe', sucursal);

            if(isEmpty(vendedor.get('qrCode'))){
              var opts = {
                type: 'image/png',
                rendererOpts: {
                  quality: 0.99
                }
              }

              QRCode.toDataURL(vendedor.get('id'), opts, function (err, url) {
                  if (err) throw err
                  vendedor.set('qrCode', url)
              })
            }

            if(isNew){
                //console.log('Nuevo')
                this.get('firebase').auth().createUserWithEmailAndPassword(this.get('halfmail') + "@panlavillita.mx", this.get('password')).then((newUser)=>{
                    vendedor.set('uid', newUser.uid);
                    //console.log(sucursal.get('vendedoresId'))
                    vendedor.save().then(()=>{
                      sucursal.get('cajeros').then((vendedoresList)=>{
                        vendedoresList.pushObject(vendedor)
                        vendedoresList.save().then(()=>{
                          sucursal.save().then(()=>{
                            this.sendAction('saveVendedor')
                          })
                        })
                      })
                    })
                })
            } else {
                //console.log('Editado')
                this.get('sucursal').then((newSucursal)=>{
                  vendedor.save().then(()=>{
                    newSucursal.get('cajeros').then((vendedoresList)=>{
                      vendedoresList.pushObject(vendedor)
                      vendedoresList.save().then(()=>{
                        newSucursal.save().then(()=>{
                          this.sendAction('saveVendedor')
                        })
                      })
                    })
                  })
                })
            }
        }
    }
});
