import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import Table from 'ember-light-table';
import { isEmpty } from '@ember/utils';
import moment from 'moment';
import DS from 'ember-data';

export default Controller.extend({
	currentUser: service(),
	currentDayUnix: computed('currentDay', function(){
		return moment(this.get('currentDay')).format('x');
	}),

	height: '70vh',
  columns: computed(function() {
    return [{
      label: 'Fecha',
      valuePath: 'venta.fechaExpedicion',
      cellComponent: 'dt-date'
    }, {
      label: 'Hora de Expedición',
      valuePath: 'venta.fechaExpedicion',
      cellComponent: 'dt-hour'
    }, {
      label: 'Hora de Cobro',
      valuePath: 'fecha',
      cellComponent: 'dt-hour'
    }, {
      label: 'Cantidad',
      valuePath: 'venta.importeTotal',
			cellComponent: 'price-wrapper'
    }, {
      label: 'Status',
      valuePath: 'venta.status',
    }, {
      label: 'Acciones',
      valuePath: 'id',
			sortable: false,
			cellComponent: 'dt-cancel'
    }];
  }),
  sort: 'venta.fechaExpedicion',

	filteredModel:computed('model', function(){
		return this.get('model').filter(function(item){
			return item.get('fecha') > 0;
		});
	}),

  actions: {
    changeFecha(){
       let fecha=moment().format(event.target.dataset.pick)
       this.transitionToRoute({ queryParams: { date: fecha}});
    },

    sendRequest(cobro, motivo) {
			this.get('currentUser.account').then((cajero)=>{
				cajero.get('cajeroDe').then((sucursal)=>{
					this.store.createRecord('cancelar-request', {
						cobro: cobro,
						motivo: motivo,
						sucursal: sucursal,
						cajero: cajero,
					}).save().then((cancelacion) => {
						cobro.set('cancelacion', cancelacion);
						cobro.save().then(()=>{
							cobro.get('venta').then((venta) => {
								venta.set('status', "Cancelación Solicitada")
								venta.save().then(()=>{
									window.swal(
										'Solicitud Enviada',
										'Espera la aprobación',
										'success'
									)
								})
							})
						})
					})
				})
			})
    },

    cancel(cobro){
      this.set('selectedCobro', cobro)
      window.$('#modal1').modal('open');
    }

  }
});
