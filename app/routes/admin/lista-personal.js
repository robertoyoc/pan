import Route from '@ember/routing/route';
import {inject as service} from "@ember/service";
import {hash} from 'rsvp';

export default Route.extend({
  	currentUser: service(),

    model(){
      return hash({
        cajeros: this.get('currentUser.account').then((account)=>{
          return account.get('administradorDe').then((sucursal)=>{
            return sucursal.get('cajeros').then((cajerosList)=>{
              return cajerosList;
            })
          })
        }),
        vendedores: this.get('currentUser.account').then((account)=>{
          return account.get('administradorDe').then((sucursal)=>{
            return sucursal.get('vendedores').then((vendedoresList)=>{
              return vendedoresList;
            })
          })
        })
      })

  }
});
