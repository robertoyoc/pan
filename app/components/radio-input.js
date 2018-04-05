import Component from '@ember/component';

export default Component.extend({
	actions: {
		mutRadio(t, value){			
			event.preventDefault()

			if(this.get('myModel.periodoVisita')==value.currentTarget.id){
				return this.set('myModel.periodoVisita', null)
			}
			let proveedor = this.get('myModel')
			proveedor.set('periodoVisita', value.currentTarget.id)
			this.sendAction('setRadioSelect', value.currentTarget.id)
		},
	}

});
