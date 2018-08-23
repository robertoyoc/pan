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

    return this.get('currentUser.account').then((account) => {
      return account.get('cajeroDe').then((sucursal)=>{
        this.set('accountId', account.get('id'));
        this.set('sucursalId', sucursal.get('id'));
        let context = this;
        return new Promise(function(resolve, reject) {
          context.filterCustom(context.store, 'retiro', {
            'sucursal': ['==', sucursal.get('id')],
            'fecha': ['>=', startDate.unix()]
          }, function(retiros) {
            let retirosList = [];
              retiros.forEach(function(retiro){
                if (retiro.get('fecha') <= endDate.unix()) {
                  retirosList.pushObject(retiro);
                }
              })
              return resolve(retirosList);
          })
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
