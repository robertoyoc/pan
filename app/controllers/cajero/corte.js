import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from "@ember/service";
import { isEmpty } from '@ember/utils';
import DS from 'ember-data';
import moment from 'moment';
import { all } from 'rsvp';
import FindQuery from 'ember-emberfire-find-query/mixins/find-query';

export default Controller.extend(FindQuery, {
  currentUser: service(),

  currentDayUnix: computed('currentDay', function(){
    return moment(this.get('currentDay')).format('x');
  }),
  isToday: computed('currentDay', function(){
    let currentUnix = moment(this.get('currentDay')).format('X');
    let today = moment();
    return (currentUnix > today.clone().startOf('day').unix()) ? (currentUnix < today.clone().endOf('day').unix()) ? true : false  : false;
  }),

  turno: computed(function(){
      return (moment().format('HH') < 14) ? 'Matutino': 'Vespertino';
  }),
  turnoAnterior: computed('turno', function(){
    return (this.get('turno') == 'Matutino') ? 'Vespertino': 'Matutino';
  }),

  fechaCorte: computed(function(){
    return moment();
  }),
  fechaCorteAnterior: computed('turno', function(){
    return (this.get('turno') == 'Matutino') ? moment().add(-1, 'days') : moment();
  }),

  sucursalActual: computed(function(){
      return DS.PromiseObject.create({
          promise: this.get('currentUser.account').then((account)=>{
              return account.get('cajeroDe')
          })
      })
  }),
  currentSucursal: computed('sucursalActual.content', function(){
    return this.get('sucursalActual.content')
  }),

  corteAnterioor: computed('fechaCorteAnterior', 'turnoAnterior', function(){
      let turno = this.get('turnoAnterior'), startDate, endDate;
      let fechaCorte = this.get('fechaCorteAnterior');
      startDate = (turno == 'Matutino') ? fechaCorte.clone().startOf('day').utc() : fechaCorte.clone().startOf('day').add(14, 'hours');
      endDate = (turno == 'Matutino') ? startDate.clone().add({hours: 13, minutes: 59}): fechaCorte.clone().endOf('day').utc();
      return DS.PromiseObject.create({
          promise: this.get('currentUser.account').then((account)=>{
              return account.get('cajeroDe').then((sucursal)=>{
                let sucursal_id = sucursal.get('id');
                let turno = this.get('turno');
                let turnoAnterior = this.get('turnoAnterior');
                let context = this;
                return new Promise(function (resolve, reject){
                    context.filterCustom(context.store, 'box-cut', {
                        'turno': ['==', turnoAnterior],
                        'fecha': ['>=', startDate.unix()],
                        'isAutomatic': ['==', true],
                    }, function(cortes){
                        cortes.forEach((corte)=>{
                            if(corte.get('fecha') <= endDate.unix()){
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

  corteAntepasaado: computed('fechaCorteAnterior', 'turnoAnterior', function(){
      let turno = this.get('turnoAnterior'), startDate, endDate;
      let fechaCorte = this.get('fechaCorteAnterior');
      startDate = (turno == 'Matutino') ? fechaCorte.clone().startOf('day').utc() : fechaCorte.clone().startOf('day').add(14, 'hours');
      endDate = (turno == 'Matutino') ? startDate.clone().add({hours: 13, minutes: 59}): fechaCorte.clone().endOf('day').utc();
      return DS.PromiseObject.create({
          promise: this.get('currentUser.account').then((account)=>{
              return account.get('cajeroDe').then((sucursal)=>{
                let sucursal_id = sucursal.get('id');
                let turno = this.get('turno');
                let turnoAnterior = this.get('turnoAnterior');
                let context = this;
                return new Promise(function (resolve, reject){
                    context.filterCustom(context.store, 'box-cut', {
                        'turno': ['==', turnoAnterior],
                        'fecha': ['>=', startDate.unix()],
                        'isAutomatic': ['==', true],
                    }, function(cortes){
                        cortes.forEach((corte)=>{
                            if(corte.get('fecha') <= endDate.unix()){
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
  corteAntepasado: computed('corteAntepasaado.content', function(){
    return this.get('corteAntepasaado.content')
  }),


  actions: {
    changeFecha(){
       let fecha=moment().format(event.target.dataset.pick)
       this.transitionToRoute({ queryParams: { date: fecha}});
    },

    openModal() {
      this.set('selectedCorte', this.store.createRecord('box-cut', {
        isAutomatic: false
      }));
      window.$('#modal1').modal('open');
    },
    openModal2() {
      this.set('selectedCorte', this.store.createRecord('box-cut', {
        isAutomatic: true
      }));
      window.$('#modal2').modal('open');
    },

    generateCorteAnterior(corte, fecha, turno, sucursal){
      let startDate, endDate;
      startDate = (turno == 'Matutino') ? fecha.clone().startOf('day').utc() : fecha.clone().startOf('day').add(14, 'hours');
      endDate = (turno == 'Matutino') ? startDate.clone().add({hours: 13, minutes: 59}): fecha.clone().endOf('day').utc() ;

      corte.set('sucursal', sucursal);
      corte.set('fecha', endDate.unix());
      corte.set('turno', turno);

      return corte.get('cobros').then((cobrosList)=>{
        let sucursal_id = sucursal.get('id');
        let context = this;
        return new Promise(function (resolve, reject){
          context.filterCustom(context.store, 'cobro', {
            'sucursal.id': ['==', sucursal_id],
            'fecha': ['>=', startDate.unix()],
          },function(cobros){
            all(
              cobros.map((cobro)=>{
                return cobro.get('venta').then((venta)=>{
                  if(cobro.get('fecha') <= endDate.unix() && venta.get('status') ==  'Pagado'){
                    cobrosList.pushObject(cobro)
                  }
                })
              })
            ).then(()=>{
              return resolve(cobrosList);
            })
          })
        }).then((cobrosList)=>{
          return cobrosList.save().then(()=>{
            return corte.get('retiros').then((retirosList)=>{
              return new Promise(function (resolve, reject){
                context.filterCustom(context.store, 'retiro', {
                  'sucursal.id': ['==', sucursal_id],
                  'fechaCobro': ['>=', startDate.unix()],
                  'status': ['==', 'Entregado']
                },function(retiros){
                  retiros.forEach((retiro)=>{
                    if(retiro.get('fechaCobro') <= endDate.unix()){
                      retirosList.pushObject(retiro)
                    }
                  })
                  return resolve(retirosList);
                })
              }).then((retirosList)=>{
                return retirosList.save().then(()=>{

                  return corte.save().then(()=>{
                    window.swal(
                      'Éxito',
                      'Corte Generado.',
                      'success'
                    )
                  })

                })
              })

            })

          })
        })
      })

    },
    generateCorteMomento(corte, corteAnterior, fecha, turno, sucursal){
      if(!isBlank(corteAnterior)){

        let startDate, endDate;
        startDate = (turno == 'Matutino') ? fecha.clone().startOf('day').utc() : fecha.clone().startOf('day').add(14, 'hours');
        endDate = moment();

        corte.set('sucursal', sucursal);
        corte.set('fecha', endDate.unix());
        corte.set('turno', turno);
        corte.set('corteAnterior', corteAnterior);

        return corte.get('cobros').then((cobrosList)=>{
          let sucursal_id = sucursal.get('id');
          let context = this;
          return new Promise(function (resolve, reject){
            context.filterCustom(context.store, 'cobro', {
              'sucursal.id': ['==', sucursal_id],
              'fecha': ['>=', startDate.unix()],
            },function(cobros){
              all(
                cobros.map((cobro)=>{
                  return cobro.get('venta').then((venta)=>{
                    if(cobro.get('fecha') <= endDate.unix() && venta.get('status') ==  'Pagado'){
                      cobrosList.pushObject(cobro)
                    }
                  })
                })
              ).then(()=>{
                return resolve(cobrosList);
              })
            })
          }).then((cobrosList)=>{
            return cobrosList.save().then(()=>{
              return corte.get('retiros').then((retirosList)=>{
                return new Promise(function (resolve, reject){
                  context.filterCustom(context.store, 'retiro', {
                    'sucursal.id': ['==', sucursal_id],
                    'fechaCobro': ['>=', startDate.unix()],
                    'status': ['==', 'Entregado']
                  },function(retiros){
                    retiros.forEach((retiro)=>{
                      if(retiro.get('fechaCobro') <= endDate.unix()){
                        retirosList.pushObject(retiro)
                      }
                    })
                    return resolve(retirosList);
                  })
                }).then((retirosList)=>{
                  return retirosList.save().then(()=>{

                    return corte.save().then(()=>{
                      window.swal(
                        'Éxito',
                        'Corte Generado.',
                        'success'
                      )
                    })

                  })
                })

              })

            })
          })
        })

      } else {
        window.swal(
          'Error',
          'Genera el corte del turno anterior.',
          'error'
        )
      }
    }

  }
});
