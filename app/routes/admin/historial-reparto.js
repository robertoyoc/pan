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

	beforeModel(){
		return this.get('currentUser.account').then((account)=>{
			this.set('fixR', this.store.createRecord('reparto', {
				fechaUnix: 4080089937,
				sucursal: account.get('sucursal')

			}))

		})

	},

	model(params){
		let dateFromParams = this.dateFromParams(params),
			endDate;

		if(Number(params.month) == -1){
			endDate = dateFromParams.clone().endOf('year').utc();
		} else if (Number(params.day) == -1){
			endDate = dateFromParams.clone().endOf('month').utc();
		} else{
			endDate = dateFromParams.clone().endOf('day').utc();
		}

		// Find-query 
		return this.get('currentUser.account').then((account)=>{
			let sucursal_id = account.get('sucursal.id');		
				let context = this;
				return new Promise(function (resolve, reject){
					context.filterCustom(context.store, 'reparto', {
						'sucursal.id': ['==', sucursal_id],
						'fechaUnix': ['>=', dateFromParams.clone().startOf('day').utc().unix()],
					}, function(repartos){
						let repartosList = [];
						repartos.forEach(function(reparto){
							if (reparto.get('fechaUnix') <= endDate.unix()) {
								repartosList.pushObject(reparto);
							}
						})
						return resolve(repartosList)
				})
			})
		})
	},
	afterModel(){
		this.get('fixR').destroyRecord()
	}
});