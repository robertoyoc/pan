import Route from '@ember/routing/route';
import FindQuery from 'ember-emberfire-find-query/mixins/find-query';
import { inject as service } from "@ember/service";
import { all } from 'rsvp';

export default Route.extend(FindQuery, {

  queryParams: {
    date: {
      refreshModel: true
    }
  },

  dateFromParams(params) {
    return moment(Number(params.date));
  },

  model(params) {
    let dateFromParams = this.dateFromParams(params),
      startDate, endDate;
    startDate = dateFromParams.clone().startOf('day').utc();
    endDate = dateFromParams.clone().endOf('day').utc();
    this.set('currentDay', dateFromParams);
    let context=this;
    return new Promise(function(resolve, reject) {
      context.filterCustom(context.store, 'cancelar-request', {
        'cobro.fecha': ['>=', startDate.unix()],
        //'status': ['==', 'Cancelación Pendiente']
      }, function(cancelaciones){
          let cancelacionesList = [];
          return all(
            cancelaciones.map((cancelacion)=>{
              return cancelacion.get('cobro').then((cobro)=>{
                if(cobro.get('fecha') <= endDate.unix()){
                  cancelacionesList.pushObject(cancelacion);
                }
              })
            })
          ).then(()=>{
            return resolve(cancelacionesList);
          });
      });
    })
  },

  setupController(controller, model){
    this._super(...arguments);
    controller.set('currentDay', this.get('currentDay'))
  }
});
