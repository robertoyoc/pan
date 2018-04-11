import Component from '@ember/component';
import moment from 'moment';
import { computed } from '@ember/object';

export default Component.extend({
    month: null,
    day: null,
    
    daysInMonth: computed('month',function(){
		if(!this.get('year') || !this.get('month') || this.get('month') == '-1'){ return [] }

		let monthObj = moment([this.get('year'), Number(this.get('month')) - 1, 1]);
		let daysInMonth = monthObj.daysInMonth();

		return Array.from(Array(daysInMonth), (_,x) => `${x + 1}`);
	})
});
