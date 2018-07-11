import Route from '@ember/routing/route';
import {inject as service} from "@ember/service";
import FindQuery from 'ember-emberfire-find-query/mixins/find-query';

export default Route.extend(FindQuery, {
    currentUser: service(),

    queryParams: {
		day: {
			refreshModel: true
		},
		month: {
			refreshModel: true
		},
		year: {
			refreshModel: true
		},
	},

    dateFromParams(params) {
		let month = params.month == "-1" ? null : Number(params.month);
		let day = params.day == "-1" ? null : Number(params.day);
		return moment([Number(params.year) || 2018, (month || 1) - 1, day || 1]);
    },

    model(params){
        let dateFromParams = this.dateFromParams(params)

        return this.get('currentUser.account').then((account)=>{
            let sucursal_id = account.get('vendedorDe.id');
            let context = this;
			return new Promise(function (resolve, reject){
				context.filterCustom(context.store, 'venta', {
					'sucursal.id': ['==', sucursal_id],
					'fechaUnix': ['>', dateFromParams.clone().startOf('day').utc().unix()],
				}, function(ventas){
					let ventasList = [];
					ventas.forEach(function(venta){
						if (venta.get('fechaUnix') < dateFromParams.clone().endOf('day').utc().unix()) {
							ventasList.pushObject(venta);
						}
						//console.log(venta.get('pedidos').get('firstObject'))
					})
					// debugger
					return resolve(ventasList)
			    })
		    })
		})
    }

});
