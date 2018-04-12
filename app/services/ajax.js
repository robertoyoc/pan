import Service from '@ember/service';
import AjaxService from 'ember-ajax/services/ajax';
import {computed} from "@ember/object"

export default AjaxService.extend({
  host: 'https://us-central1-panlavillita-dev.cloudfunctions.net/api',
  headers: computed(function(){
  	let headers  = {}
  	headers['Access-Control-Allow-Origin'] = "*";
  	return headers
  })
});