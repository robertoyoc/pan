import Controller from '@ember/controller';
import { inject as service } from "@ember/service";
import { computed } from '@ember/object';

export default Controller.extend({
    store: service(),

    month: moment().format('MM'),
    day: moment().format('DD'),
    year: moment().format('YYYY'),

    actions: {
      // TRANSICIONES
      processVenta(venta){
          this.transitionToRoute('vendedor.venta', venta.id);
      },
      historialVenta(venta, day, month, year){
        this.transitionToRoute('vendedor.historial-venta', { queryParams: { year: year, month: month, day: day   }});
      },

      signOut(){
        window.swal({
          title: 'Estás seguro?',
          text: 'Tu sesión será cerrada',
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, salir',
          cancelButtonText: 'No',
          confirmButtonClass: 'confirm-class',
          cancelButtonClass: 'cancel-class',
          closeOnConfirm: false,
          closeOnCancel: false

        }).then(()=>{
          this.get('session').close();
          this.transitionToRoute('index');
            window.swal({
              type: 'success',
              title: 'Sesión cerrada!',
              text: 'Gracias por tu visita.',
              timer: 500
            });
        }).catch(()=>{});
      }
    }

});
