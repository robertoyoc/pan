import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
      editAdministrador(administrador) {
    this.transitionToRoute('dueno.edit-administrador', administrador.get('id'))
      },

      deleteAdministrador(administrador) {
      window.swal({
      title: 'Estás seguro?',
      text: 'El administrador será eliminado',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'No',
      confirmButtonClass: 'confirm-class',
      cancelButtonClass: 'cancel-class',
      // closeOnConfirm: false,
      // closeOnCancel: false
    }).then(()=>{
      administrador.destroyRecord();
    }).catch(()=>{});

    }
  }
});
