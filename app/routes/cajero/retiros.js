import Route from '@ember/routing/route';
import FindQuery from 'ember-emberfire-find-query/mixins/find-query';
import { inject as service } from "@ember/service";
import moment from 'moment';

export default Route.extend(FindQuery, {
    currentUser: service(),

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

      return this.get('currentUser.account').then((account) => {
        return account.get('cajeroDe').then((sucursal)=> {
          let sucursal_id = sucursal.get('id');
          let context=this;
          return new Promise(function(resolve, reject) {
            context.filterCustom(context.store, 'retiro', {
              'fechaExpedicion': ['>=', startDate.unix()],
              'sucursal.id': ['==', sucursal_id],
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
        });
      });
    },

    setupController(controller, model){
      console.log(model);
      this._super(...arguments);
      controller.set('currentDay', this.get('currentDay'))
    }
});
