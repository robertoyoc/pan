import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import Table from 'ember-light-table';
import { isEmpty } from '@ember/utils';
import moment from 'moment';
import DS from 'ember-data';

export default Controller.extend({
  currentDayUnix: computed('currentDay', function(){
    return moment(this.get('currentDay')).format('x');
  }),

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
