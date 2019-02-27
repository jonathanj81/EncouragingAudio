const daysJSON = require('./wordsData.json');

module.exports = {
    getCurrentWords: function() {
      return daysJSON[daysJSON.length-1];
    },
    getFirstWords: function() {
      return daysJSON[0];
    },
    getNextWords: function(index) {
      let newIndex = index+1 < daysJSON.length ? index+1 : 0;
      return daysJSON[newIndex];
    },
    getPreviousWords: function(index) {
      let newIndex = index > 0 ? index-1 : daysJSON.length-1;
      return daysJSON[newIndex];
    },
    getWordIndex: function(word){
      return daysJSON.indexOf(word);
    },
    getWord: function(index){
      return daysJSON[index];
    },
    updateIndex: function(index){
      return index+1 < daysJSON.length ? index+1 : 0;
    }
}
