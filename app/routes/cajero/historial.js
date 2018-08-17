import Route from '@ember/routing/route';
import FindQuery from 'ember-emberfire-find-query/mixins/find-query';
import { inject as service } from "@ember/service";

export default Route.extend(FindQuery, {
  currentUser: service(),

  queryParams: {
    date: {
      refreshModel: true
    },
    isToday: {
      refreshModel: true
    }
  },

  dateFromParams(params) {
    let fechaUnix = (params.isToday == 'true') ? moment.unix(params.date) : moment(Number(params.date));
    return moment(fechaUnix);
  },

  model(params) {
    let dateFromParams = this.dateFromParams(params),
      startDate, endDate;
    startDate = dateFromParams.clone().startOf('day').utc();
    endDate = dateFromParams.clone().endOf('day').utc();
    this.set('currentDay', dateFromParams);

    return this.get('currentUser.account').then((account) => {
      return account.get('cajeroDe').then((sucursal)=> {
        //console.log(startDate.unix());
        let sucursal_id = sucursal.get('id');
        let context = this;
        return new Promise(function(resolve, reject) {
            context.filterCustom(context.store, 'cobro', {
              'sucursal.id': ['==', sucursal_id],
              'fecha': ['>=', startDate.unix()],
            }, function(cobros){
              //console.log(cobros)
              let cobrosList = [];
              cobros.forEach(function(cobro){
                if (cobro.get('fecha') <= endDate.unix()) {
                  cobrosList.pushObject(cobro);
                }
              })
              //console.log(cobrosList)
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
