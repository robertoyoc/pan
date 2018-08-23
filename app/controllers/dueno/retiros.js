import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { isEmpty, isBlank } from '@ember/utils';
import { computed } from '@ember/object';
import Table from 'ember-light-table';
import moment from 'moment';
import DS from 'ember-data';

export default Controller.extend({
  currentDayUnix: computed('currentDay', function(){
    return moment(this.get('currentDay')).format('x');
  }),

  height: '65vh',
  columns: computed(function() {
    return [{
      label: 'Fecha de Expedición',
      valuePath: 'fechaExpedicion',
      cellComponent: 'dt-date'
    }, {
      label: 'Hora de Expedición',
      valuePath: 'fechaExpedicion',
      cellComponent: 'dt-hour'
    }, {
      label: 'Hora de Cobro',
      valuePath: 'fechaCobro',
      cellComponent: 'dt-hour'
    }, {
      label: 'Cantidad',
      valuePath: 'cantidad',
      cellComponent: 'price-wrapper'
    }, {
      label: 'Sucursal',
      valuePath: 'sucursal.nombre',
    }, {
      label: 'Destinatario',
      valuePath: 'destinatario',
    }, {
      label: 'Status',
      valuePath: 'status',
    }];
  }),
  sort: 'fechaExpedicion',
  filteredModel:computed('model', function(){
    return this.get('model').filter(function(item){
      return item.get('fechaExpedicion') > 0;
    });
  }),

  sucursales: computed(function() {
    return this.store.findAll('sucursal')
  }),

  actions: {
    changeFecha(){
       let fecha=moment().format(event.target.dataset.pick)
       this.transitionToRoute({ queryParams: { date: fecha}});
    },

    openModal() {
      this.set('selectedRetiro', this.store.createRecord('retiro', {

      }));
      window.$('#modal1').modal('open');
    },

    sendRequest(retiro, selectedSucursal) {
      if(!isBlank(selectedSucursal)){
        this.store.findRecord('sucursal', selectedSucursal).then((sucursal)=>{
          sucursal.get('retiros').then((retirosList)=>{
            retirosList.pushObject(retiro);
            retirosList.save().then(()=>{
              sucursal.save().then(()=>{
                retiro.set('sucursal', sucursal);
                retiro.set('fechaExpedicion', moment().unix());
                retiro.save().then(() => {
                  window.swal(
                    'Retiro Autorizado',
                    'El destinatario puede pasar a recoger su retiro.',
                    'success'
                  )
              })
            })
          })
          })
        })
      } else {
        window.swal(
          'Error',
          'Selecciona una sucursal.',
          'error'
        )
      }
    },
  }

});
