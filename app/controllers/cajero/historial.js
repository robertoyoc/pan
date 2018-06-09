import Controller from '@ember/controller';
import moment from 'moment';

export default Controller.extend({
  actions: {
    changeFecha(){
       let fecha=moment().format(event.target.dataset.pick)
       // let fechaUnix = moment.unix(fecha)
       // console.log(fechaUnix)
       this.transitionToRoute({ queryParams: { date: fecha, isToday: false }});
    },

    openModal(cobro) {
      this.set('selectedCobro', cobro)
      window.$('#modal1').modal('open');
    },

    sendRequest(cobro, motivo) {
      this.store.createRecord('cancelar-request', {
        cobro: cobro,
        motivo: motivo,
        sucursalId: this.get('sucursalId'),
        accountId: this.get('accountId'),
      }).save().then(() => {
        cobro.get('venta').then((venta) => {
          venta.set('status', "Cancelación solicitada")
          venta.save()
          window.swal(
            'Solicitud Enviada',
            'Espera la aprobación',
            'success'
          )
        })
      })
    }

  }
});
