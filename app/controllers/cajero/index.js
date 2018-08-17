import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
import { inject as service } from '@ember/service';
import moment from 'moment';
import FindQuery from 'ember-emberfire-find-query/mixins/find-query';
import DS from 'ember-data'

export default Controller.extend(FindQuery, {
  currentUser: service(),

  today: moment().format('X'),
  result: null,
  names: ['Efectivo', 'Tarjeta Debito/Credito', 'Cheque', ],

  cajero: computed('currentUser', function(){
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

  sucursalActual: computed(function(){
      return DS.PromiseObject.create({
          promise: this.get('currentUser.account').then((account)=>{
              return account.get('cajeroDe')
          })
      })
  }),
  currentSucursal: computed('sucursalActual.content', function(){
    return this.get('sucursalActual.content')
  }),

  selectedVenta: computed('result', function() {
    if (this.get('result')) {
      return DS.PromiseObject.create({
        promise: this.store.findRecord('venta', this.get('result')).then((venta) => {
          if (venta.get('status') != 'Pagado') {
            //console.log(venta)
            //venta.set(cobro, this.get('model.id'));
            this.set('model.venta', venta);
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

  actions: {
    realizarPago(venta) {
      if (venta.get('isFulfilled')) {
        let ventaObj = venta.get('content')
        venta.set('fechaPago', moment().unix())
        ventaObj.set('status', 'Pagado')
        ventaObj.save()
      }
      let fecha =  moment().unix() // `${moment().date()} ${moment.months()[moment().month()]}, ${moment().year()}`
      this.set('model.fecha', fecha)
      this.get('model').save()
      this.set('model', this.store.createRecord('cobro', {
        sucursal: this.get('currentSucursal')
      }))
      this.set('result', null);
      window.swal(
        'Venta finalizada',
        'El ticket ha sido cobrado.',
        'success'
      )
    },

    signOut(){
        this.get('session').close();
        this.transitionToRoute('index')
    }
  }
});
