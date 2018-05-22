import Component from '@ember/component';
import { computed } from '@ember/object';
import moment from 'moment';
import { inject as service } from "@ember/service";
import { all } from 'rsvp';
import { isBlank } from '@ember/utils';

export default Component.extend({
    store: service(),

    month: moment().format('MM'),
    day: moment().format('DD'),
    year: moment().format('YYYY'),

    myCategorias: computed(function() {
        return this.get('store').findAll('categoria')
    }),

    disabledVender: computed('model', function() {
      return this.get('model.pedidos.length') > 0;
    }),

    actions: {
        delete(pedido){
          pedido.destroyRecord()
        },

        getDownloadUrl(url, redirectCount, venta) {
          console.log('venta', venta)
          redirectCount = redirectCount || 0;
          if (redirectCount > 10) {
              throw new Error("Redirected too many times.");
          }
          return new Promise(function (resolve) {
            let redirectsTo;
            return venta.get('ticketUrl').then((downloadURL)=>{
              redirectsTo = (!isBlank(downloadURL) && downloadURL != url) ? downloadURL: null;
              resolve(redirectsTo);
            }).catch(function (redirectsTo) {
              return redirectsTo
                 ? getDownloadUrl(redirectsTo, redirectCount+ 1, venta)
                : url;
          });
        })
      },

      finalizar(venta){
          venta.set('fecha', moment().format())
          all(venta.get('pedidos').invoke('save')).then(()=>{
                venta.save().then((data)=>{


                  swal({
                    title: 'Submit your Github username',
                    input: 'text',
                    inputAttributes: {
                      autocapitalize: 'off'
                    },
                    showCancelButton: true,
                    confirmButtonText: 'Look up',
                    showLoaderOnConfirm: true,
                    preConfirm: (login) => {
                      return new Promise((resolve)=>{
                        function checkData(){
                          if(data.get('ticketUrl')){
                          console.log(data.get('ticketUrl'))
                            return resolve()
                          }
                          else return setTimeout(checkData, 2000)
                        }
                        checkData()

                      })
                    },
                    allowOutsideClick: () => !swal.isLoading()
                  }).then((result) => {
                    if (result.value) {
                      swal({
                        title: `${result.value.login}'s avatar`,
                        imageUrl: result.value.avatar_url
                      })
                    }
                  })
                  //let myDownloadURL = this.send('getDownloadUrl', null, 0, venta)



              })
          })
      }
    }
});
