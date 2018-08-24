import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from "@ember/service";
import { isEmpty } from '@ember/utils';
import DS from 'ember-data';
import moment from 'moment';
import FindQuery from 'ember-emberfire-find-query/mixins/find-query';

export default Controller.extend(FindQuery, {
  currentUser: service(),
  currentDayUnix: computed('currentDay', function(){
    return moment(this.get('currentDay')).format('x');
  }),

  turno: computed(function(){
      return (moment().format('HH') < 14) ? 'Matutino': 'Vespertino';
  }),
  turnoAnterior: computed('turno', function(){
    return (this.get('turno') == 'Matutino') ? 'Vespertino': 'Matutino';
  }),

  corteAnterioor: computed('turno', 'turnoAnterior', function(){
      let today = moment(), startToday, endToday;
        startToday = today.clone().startOf('day').utc();
        endToday = today.clone().endOf('day').utc();
      let yesterday = today.add(-1, 'days'), startYesterday, endYesterday;
        startYesterday = today.clone().startOf('day').utc();
        endYesterday = today.clone().endOf('day').utc();

      return DS.PromiseObject.create({
          promise: this.get('currentUser.account').then((account)=>{
              return account.get('cajeroDe').then((sucursal)=>{
                let sucursal_id = sucursal.get('id');
                let turno = this.get('turno');
                let turnoAnterior = this.get('turnoAnterior');
                let context = this;
                return new Promise(function (resolve, reject){
                    context.filterCustom(context.store, 'roll-call', {
                        'turno': ['==', turnoAnterior],
                        'fecha': ['>=', (turno =='Matutino') ? startYesterday.unix() : startToday.unix()],
                        'isAutomatic': ['==', true],
                    }, function(cortes){
                        cortes.forEach((corte)=>{
                            if(corte.get('fecha') <= ((turno=='Matutino') ? endYesterday.unix(): endToday.unix())){
                                return resolve(corte);
                            }
                        })
                        return resolve(null);
                    })
                })

              })
          })
      })
  }),
  corteAnterior: computed('corteAnterioor.content', function(){
    return this.get('corteAnterioor.content')
  }),

  actions: {
    changeFecha(){
       let fecha=moment().format(event.target.dataset.pick)
       this.transitionToRoute({ queryParams: { date: fecha}});
    },

    openModal() {
      this.set('selectedCorte', this.store.createRecord('box-cut', {
        cajaInicial: 0
        }));
      window.$('#modal1').modal('open');
    },

    generateCorteMomento(corte, turno){
      if(!isBlank(corteAnterior)){

      }
    }

    generateCorteMomento(corte, corteAnterior){
      if(!isBlank(corteAnterior)){

      }
    }

  }
});
