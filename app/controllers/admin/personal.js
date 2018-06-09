import Controller from '@ember/controller';
import { isBlank } from '@ember/utils'
import { computed } from '@ember/object';
import FindQuery from 'ember-emberfire-find-query/mixins/find-query';
import moment from 'moment';

export default Controller.extend(FindQuery,{
    turno: computed(function(){
        if(moment().format('HH') < 14) {
            return "Matutino"
        } else {
            return "Vespertino"
        }
    })
});
