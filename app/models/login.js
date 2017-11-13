import DS from 'ember-data';

import { buildValidations, validator } from 'ember-cp-validations';


const Validations = buildValidations({
  user: validator('presence', true),
  pass: [
    validator('presence', true),
    validator('length', {
      min: 6
    })
  ]
})

export default DS.Model.extend(Validations, {
  user: "",
  pass: ""

});
