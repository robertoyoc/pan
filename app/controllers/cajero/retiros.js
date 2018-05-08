import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    openModal(retiro) {
      this.set('selectedRetiro', retiro)
      window.$('#modal1').modal('open');
    },
    sendRequest(retiro) {
      retiro.set('status', 'Entregado')
      retiro.save().then(() => {
        window.swal(
          'Retiro entregado',
          'Los retiros han sido contemplados',
          'success'
        )
      })

    }
  }

});
