import Route from '@ember/routing/route';
import FindQuery from 'ember-emberfire-find-query/mixins/find-query';
import { inject as service } from "@ember/service";

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
        let context = this;
        return new Promise(function(resolve, reject) {
            context.filterCustom(context.store, 'cobro', {
              'sucursal.id': ['==', sucursal_id],
              'fecha': ['>=', startDate.unix()],
            }, function(cobros){
              let cobrosList = [];
              cobros.forEach(function(cobro){
                if (cobro.get('fecha') <= endDate.unix()) {
                  cobrosList.pushObject(cobro);
                }
              })
              return resolve(cobrosList)
          })
        })
      });
    })
  },

  setupController(controller, model){
		this._super(...arguments);
    controller.set('currentDay', this.get('currentDay'))
	}
});
