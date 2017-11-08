import Controller from '@ember/controller';

export default Controller.extend({

  prueba: 1,
  actions: {
    add(){
      this.set('prueba', this.get('prueba')+1)
    }
  }
});
