import Component from '@ember/component';
import { computed } from '@ember/object';
import moment from 'moment';
import { inject as service } from "@ember/service";
import { all } from 'rsvp';

export default Component.extend({
    store: service(),

    month: moment().format('MM'),
    day: moment().format('DD'),
    year: moment().format('YYYY'),

    myCategorias: computed(function() {
        return this.get('store').findAll('categoria')
    }),

    disabledVender: computed('myModel', 'isVenta', function() {
      if(this.get('isVenta')) {
        return this.get('myModel.venta.pedidos.length') > 0;
      } else {
        return this.get('myModel.cortesia.pedidos.length') > 0;
      }
    }),

    disabledLinkventa: computed('isNew', 'isVenta', function(){
      if(this.get('isNew')){
        return false
      } else {
        return !this.get('isVenta')
      }
    }),

    disabledLinkcortesia: computed('isNew', 'isVenta', function(){
      if(this.get('isNew')){
        return false
      } else {
        return this.get('isVenta')
      }
    }),

    actions: {
        delete(pedido){
			pedido.destroyRecord()
        },

        finalizar(venta){
            venta.set('fecha', moment().format())
			      all(venta.get('pedidos').invoke('save')).then(()=>{
				          venta.save().then(()=>{
                    let tagg = (this.get('isVenta'))? "VENTA": "CORTESÍA";
                    window.swal({
                        title: '<i> '+ tagg +'</i>',
                        type: 'info',
                        html:
                            '<a href="'+
                            // https://firebasestorage.googleapis.com/v0/b/panlavillita-dev.appspot.com/o/ticket-ventas%2F-LAq_L91h6n1HTGRTAcF%2Fventa--LAq_L91h6n1HTGRTAcF.pdf?alt=media&token=609d1026-e30e-455d-852d-57260f546b21
                            // https://firebasestorage.googleapis.com/v0/b/panlavillita-dev.appspot.com/o/ticket-ventas%2F-LAq_L91h6n1HTGRTAcF%2Fventa--LAq_L91h6n1HTGRTAcF.pdf?alt=media&token=609d1026-e30e-455d-852d-57260f546b21
                            // https://firebasestorage.googleapis.com/v0/b/panlavillita-dev.appspot.com/o/ticket-ventas%2F-LAqCJnoYxyxv254qFaS%2Fventa--LAqCJnoYxyxv254qFaS.pdf?alt=media&token=233b2559-651a-4ac6-aff3-95c3a960e68d
                            //venta.get('')+
                            '//github.com">Ticket</a> ',
                            confirmButtonColor: '#3085d6',
                            confirmButtonText: 'Ticket registrado!'
                    }).then(()=>{
                        this.sendAction('nuevaVenta', venta);
                    }).catch((error)=>{
                        console.log(error)
                    });
                    //this.sendAction('nuevaVenta', venta);
                })
            })
        },
    }
});
