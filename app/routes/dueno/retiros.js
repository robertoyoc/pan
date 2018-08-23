import Route from '@ember/routing/route';
import FindQuery from 'ember-emberfire-find-query/mixins/find-query';
import { inject as service } from "@ember/service";
import moment from 'moment';

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
      context.filterCustom(context.store, 'retiro', {
        'fechaExpedicion': ['>=', startDate.unix()],
      }, function(retiros){
          let retirosList = [];
          retiros.forEach((retiro)=>{
              if(retiro.get('fechaExpedicion') <= endDate.unix()){
                retirosList.pushObject(retiro);
              }
          })
          return resolve(retirosList);
      });
    });
  },

  setupController(controller, model){
    console.log(model);
    this._super(...arguments);
    controller.set('currentDay', this.get('currentDay'))
  }
});
