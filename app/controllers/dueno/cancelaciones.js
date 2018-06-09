import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    openModal(request) {
      this.set('selectedRequest', request)
      window.$('#modal1').modal('open');
      window.Materialize.updateTextFields()

    },
    sendAprobal(request) {
      request.set('status', "Aprobada")
      request.get('cobro.venta').then((venta) => {
        venta.set('status', "Cancelada")
        venta.save()
      }).then(() => {
        request.save()

      })

    },
    sendDenied(request) {
      request.set('status', "Denegada")
      request.get('cobro.venta').then((venta) => {
        venta.set('status', "Cancelación denegada")
        venta.save()
      }).then(() => {
        request.save()

      })
    }
  }
});
