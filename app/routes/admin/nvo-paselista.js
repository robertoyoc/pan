import Route from '@ember/routing/route';
import { inject as service } from "@ember/service";
import { all } from 'rsvp';
import moment from 'moment';

export default Route.extend({
  currentUser: service(),

  queryParams: {
    turno: {
      refreshModel: true
    }
  },

  model(params){
    return this.store.createRecord('roll-call', {
      turno: params.turno,
      fecha: moment()
    })
  },

  afterModel(model){
    return this.get('currentUser.account').then((account)=>{
      return account.get('administradorDe').then((sucursal)=>{
        return sucursal.get('cajeros').then((cajerosList)=>{
          return sucursal.get('vendedores').then((vendedoresList)=>{
            return model.get('listaAsistencia').then((rollCall)=>{

              cajerosList.forEach((cajero)=>{
                rollCall.createRecord({
                  empleado: cajero
                })
                //console.log('cajero', cajero.get('nombre'))
              })
              vendedoresList.forEach((vendedor)=>{
                rollCall.createRecord({
                  empleado: vendedor
                })
                //console.log('vendedor', vendedor.get('nombre'))
              })

              // return all(rollCall.invoke('save'))

            })
          })

        })
      })
    })
  }
});
