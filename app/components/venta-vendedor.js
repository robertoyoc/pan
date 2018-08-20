import Component from '@ember/component';
import { inject as service } from "@ember/service";
import { computed } from '@ember/object';
import { isBlank } from '@ember/utils';
import moment from 'moment';
import { all } from 'rsvp';

export default Component.extend({
    store: service(),

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

        processVenta(venta){
          venta.set('status', 'En Proceso');
          venta.save().then(()=>{
            this.sendAction('processVenta', venta);
          })
        },

        historialVenta(venta, day,  month, year){
          this.sendAction('historialVenta', venta, day, month, year);
        },

      finalizar(venta){
          venta.set('fechaExpedicion', moment().unix());
          all(
            venta.get('pedidos').invoke('save')
          ).then(()=>{
                venta.set('ticketUrl', 'https://us-central1-panlavillitamx.cloudfunctions.net/api/ventas/' + venta.get('id') + '.pdf')
                venta.set('status', 'Cobro Pendiente');
                venta.save().then((data)=>{
                  swal({
                    type: 'question',
                    confirmButtonText: '¿Confirmar Venta?',
                    showLoaderOnConfirm: true,
                    preConfirm: () => {
                      return new Promise((resolve)=>{
                        function checkData(){
                          if(data.get('ticketUrl')){
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
                        title: '<i>VENTA</i>',
                        type: 'info',
                        html:
                            '<a href="' +
                            result +
                            '" target="_blank">Imprimir Ticket</a> ',
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: '¡Operación Finalizada!',
                        allowOutsideClick: false
                      }).then(()=>{
                        this.sendAction('nuevaVenta');
                      }).catch((error)=>{
                        console.log(error)
                    });
                    }
                  })
              })
          })
      },

      signOut(){
        this.sendAction('signOut')
      }
    }
});
