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

            if(isNew){
              var opts = {
                errorCorrectionLevel: 'H',
                type: 'image/jpeg',
                rendererOpts: {
                  quality: 0.3
                }
              }

              QRCode.toDataURL(cajero.get('id'), opts, function (err, url) {
                  if (err) throw err
                  ctx.send('saveQR', url)
              })
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

        saveQR(dataURL) {
    		  let model = this.get('model');
    		  let cntx = this;
    		  let storageRef = cntx.get('firebaseApp').storage().ref();

          var blobb = this.send('dataURLtoBlob',dataURL)

            var reader = new FileReader();
    			  reader.readAsArrayBuffer(blobb)
    			  reader.onload = function(e) {
    			    var data = e.target.result;
    			    var imgRef = storageRef.child(`cajeros/${model.get('id')}/QRCode.jpeg`);
    			    imgRef.put(data).then(function(snapshot) {
    			      cntx.get('model').set('qrCode', snapshot.downloadURL);
    			      return true
    			    })
            }
    		},

        dataURLtoBlob(dataurl) {
          var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
              bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
          while(n--){
              u8arr[n] = bstr.charCodeAt(n);
          }
          return new Blob([u8arr], {type:mime});
      }
    }
});
