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
          all(
            venta.get('pedidos').invoke('save')

          ).then(()=>{
                venta.set('ticketUrl', 'https://us-central1-panlavillitamx.cloudfunctions.net/api/ventas/' + venta.get('id') + '.pdf')
                venta.save().then((data)=>{
                  swal({
                    type: 'question',
                    confirmButtonText: '¿Generar Ticket?',
                    showLoaderOnConfirm: true,
                    preConfirm: () => {
                      return new Promise((resolve)=>{
                        function checkData(){
                          if(data.get('ticketUrl')){
                            // console.log(data.get('ticketUrl'))
                            return resolve(data.get('ticketUrl'))
                          }
                          else return setTimeout(checkData, 2000)
                        }
                        checkData()
                      })
                    },
                    allowOutsideClick: false
                  }).then((result) => {
                    console.log(result)
                    if (!isBlank(result)) {
                      swal({
                        title: '<i>TICKET</i>',
                        type: 'info',
                        html:
                            '<a href="' +
                            result +
                            '" target="_blank">Ticket</a> ',
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: '¡Ticket correcto!',
                        allowOutsideClick: false
                      }).then(()=>{
                        this.sendAction('nuevaVenta', venta);
                      }).catch((error)=>{
                        console.log(error)
                    });
                    }
                  })
              })
          })
      }
    }
});
