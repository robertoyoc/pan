import Controller from '@ember/controller';
import { computed } from "@ember/object"

export default Controller.extend({
  sucursales: computed(function() {
    return this.store.findAll('sucursal')
  }),
  actions: {
    openModal() {
      this.set('selectedRetiro', this.store.createRecord('retiro'))
      window.$('#modal1').modal('open');
    },
    sendRequest(retiro) {
      retiro.set('fecha', moment().format())
      let fecha = `${moment().date()} ${moment.months()[moment().month()]}, ${moment().year()}`
      retiro.set('fechaShort', fecha)
      retiro.save().then(() => {
        window.swal(
          'Retiro aprobado',
          'El destinatario puede pasar a recoger su retiro',
          'success'
        )
      })

    },

  }

});
