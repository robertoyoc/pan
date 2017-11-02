import Ember from 'ember';

export default Ember.Component.extend({

  didInsertElement() {
      window.$("#map").html('<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3746.351467719986!2d-98.74447488559768!3d20.119379523575294!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d109fc06ef1ecb%3A0x5b1aef217f5a91f!2sPan+La+Villita!5e0!3m2!1ses!2smx!4v1499548467780" width="100%" height="450" frameborder="0" style="border:0" allowfullscreen></iframe>');

  }
});
