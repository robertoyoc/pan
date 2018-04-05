import Component from '@ember/component';

export default Component.extend({
	actions: {
		mutCheckbox(t, value){			
			event.preventDefault()
			debugger

			if(this.get('checked'))
				return this.sendAction('isNotChecked', value.currentTarget.id)
			else
				return this.sendAction('isChecked', value.currentTarget.id)
		},
	}

});
