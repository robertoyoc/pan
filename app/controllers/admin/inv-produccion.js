import Controller from '@ember/controller';
import moment from 'moment';

export default Controller.extend({
	month: moment().format('MM'),
    day: moment().format('DD'),
    year: moment().format('YYYY')
});
