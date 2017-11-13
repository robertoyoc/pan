import DS from 'ember-data';

import { buildValidations, validator } from 'ember-cp-validations';

const Validations = buildValidations({
  user: validator('presence', true),
  pass: [
    validator('presence', true),
    validator('length', {
      min: 6
    })
  ],
  nombre: validator('presence', true),
  apellido: validator('presence', true)
})

export default DS.Model.extend(Validations, {

  nombre: "",
  apellido: "",
  user: "",
  pass: ""

});
