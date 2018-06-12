import Component from '@ember/component';
import moment from 'moment';
import { all } from 'rsvp';

export default Component.extend({
  actions: {
    openModal(attendance) {
      if(!attendance.get('asistencia')){
        this.set('selectedAsistencia', attendance)
        window.$('#modal1').modal('open');
        window.Materialize.updateTextFields()
      }
    },

    closeModal(){
      this.send('resetScanner')
      window.$('#modal1').modal('close');
    },

    evalAttendance(result){
      // console.log('expected', this.get('selectedAsistencia.empleado.id'))
      // console.log('result', result)
      if(result == this.get('selectedAsistencia.empleado.id')){

        this.set('selectedAsistencia.asistencia', true);
        this.set('selectedAsistencia.fecha', moment())
        this.send('saveAll', this.get('model'));
        this.send('closeModal');
      } else {
        this.set('errorFound', 'Código incorrecto.')
      }
    },

    resetScanner(){
      this.set('errorFound', null);
      this.set('selectedAsistencia', null)
    },

    saveAll(model){
      return model.get('listaAsistencia').then((rollCall)=>{
        return all(rollCall.invoke('save')).then(()=>{
          return model.save()
        })
      })
    }
  }
});
