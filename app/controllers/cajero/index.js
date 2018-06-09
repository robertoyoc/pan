import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
import { inject as service } from '@ember/service';
import moment from 'moment';
import FindQuery from 'ember-emberfire-find-query/mixins/find-query';
import DS from 'ember-data'

export default Controller.extend(FindQuery, {
  today: moment().format('X'),
  currentUser: service(),
  
  result: null,
  names: ['Efectivo', 'Tarjeta Debito/Credito', 'Cheque', ],

  selectedVenta: computed('result', function() {
    if (this.get('result')) {
      //console.log(this.get('result'))
      return DS.PromiseObject.create({
        promise: this.store.findRecord('venta', this.get('result')).then((venta) => {
          if (!venta.get('fechaPago')) {
            console.log(venta)
            this.set('model.venta', venta)
            return venta;
          } else {
            window.swal(
              'Venta registrada',
              'Este ticket ya fue cobrado',
              'warning'
            )
          }
        })
      })
    } else {
      return null;
    }
  }),

  disabledPagar: computed('model.pago', 'selectedVenta', function() {
    return Number(this.get('model.pago')) >= Number(this.get('selectedVenta.importeTotal'));
  }),

  cambioCliente: computed('model.pago', 'selectedVenta', function() {
    if (this.get('selectedVenta.importeTotal')) {
      if (Number(this.get('model.pago')) >= Number(this.get('selectedVenta.importeTotal'))) {
        let cambio = Number(this.get('model.pago')) - Number(this.get('selectedVenta.importeTotal'))
        this.set('model.cambio', cambio)
        return cambio
      } else
        return 0
    } else {
      return 0;
    }
  }),

  currentCajero: computed('store', 'currentUser', function(){
    console.log(this.get('curentUser'))
    if(!isEmpty(this.get('currentUser.account'))) {
      return DS.PromiseObject.create({
        promise: this.get('currentUser.account').then((account)=>{
            return account;
        })
      });
    } else {
      return null
    }
  }),

  actions: {
    realizarPago(venta) {
      if (venta.get('isFulfilled')) {
        let ventaObj = venta.get('content')
        venta.set('fechaPago', moment().format())
        ventaObj.set('status', 'Pagado')
        ventaObj.save()
      }
      let fecha =  moment().format() // `${moment().date()} ${moment.months()[moment().month()]}, ${moment().year()}`
      this.set('model.fecha', fecha)
      this.get('model').save()
      this.set('model', this.store.createRecord('cobro', {
        sucursalId: this.get('sucursalId')
      }))
      this.set('result', null);
      window.swal(
        'Venta finalizada',
        'El ticket ha sido generado',
        'success'
      )
    },

    signOut(){
        this.get('session').close();
        this.transitionToRoute('index')
    }
  }
});
