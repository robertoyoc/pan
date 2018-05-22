import Route from '@ember/routing/route';
import FindQuery from 'ember-emberfire-find-query/mixins/find-query';
import { inject as service } from "@ember/service";
import moment from 'moment';

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

    return this.get('currentUser.account').then((account) => {
      this.set('accountId', account.get('id'))
      let sucursal = account.get('sucursal');
      this.set('sucursalId', sucursal.get('id'))

      let context = this;
      return new Promise(function(resolve, reject) {
          context.filterCustom(context.store, 'cobro', {
            'sucursalId': ['==', sucursal.get('id')],
            'fechaUnix': ['>=', startDate.unix()],
          }, function(cobros){
            let cobrosList = [];
            cobros.forEach(function(cobro){
              if (cobro.get('fechaUnix') <= endDate.unix()) {
                cobrosList.pushObject(cobro);
              }
            })
            return resolve(cobrosList)
        })
      })
    })
  },
  
  setupController(controller) {
    this._super(...arguments)
    controller.set('sucursalId', this.get('sucursalId'))
    controller.set('accountId', this.get('accountId'))

  }
});
