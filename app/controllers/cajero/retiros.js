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
