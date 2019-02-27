'use strict';

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const { App } = require('jovo-framework');
const { Alexa } = require('jovo-platform-alexa');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');

const app = new App();

app.use(
    new Alexa(),
    new JovoDebugger(),
    new FileDb()
);


// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------
const Fetcher = require('./fetch.js');

app.setHandler({
    LAUNCH() {
      if(this.$user.isNew()){
        this.tell("Welcome to encouraging word. To begin, say play today's word");
      }else{
        this.toIntent('ResumeIntent');
      }
    },
    PlayIntent() {
        let word;
        word = Fetcher.getFirstWords();
        let currentIndex = Fetcher.getWordIndex(word);
        this.$user.$data.currentIndex = currentIndex;
        this.$alexaSkill.$audioPlayer
          .setOffsetInMilliseconds(0)
          .play(word.url,`${currentIndex}`);
    },
    PauseIntent() {
        this.$alexaSkill.$audioPlayer.stop();

        // Save offset to database
        this.$user.$data.offset = this.$alexaSkill.$audioPlayer.getOffsetInMilliseconds();
        this.tell('Paused!');
    },
    ResumeIntent() {
      let word = Fetcher.getWord(this.$user.$data.currentIndex);
        this.$alexaSkill.$audioPlayer
            .setOffsetInMilliseconds(this.$user.$data.offset)
            .play(word.url, `${currentIndex}`)
            .tell('Resuming!');
    },
    StartOverIntent() {
        this.tell('Not implemented');
    },
    ShuffleOnIntent() {
        this.tell('Not implemented');
    },
    ShuffleOffIntent() {
        this.tell('Not implemented');
    },
    RepeatIntent() {
        this.tell('Not implemented');
    },
    PreviousIntent() {
      let currentIndex = this.$user.$data.currentIndex;
      let previousWord = Fetcher.getPreviousWords(currentIndex);
      currentIndex = Fetcher.getWordIndex(nextWord);
      this.$user.$data.currentIndex = currentIndex;
      this.$alexaSkill.$audioPlayer.setOffsetInMilliseconds(0)
        .play(previousWord.url, `${currentIndex}`);
    },
    NextIntent() {
        let currentIndex = this.$user.$data.currentIndex;
        let nextWord = Fetcher.getNextWords(currentIndex);
        currentIndex = Fetcher.getWordIndex(nextWord);
        this.$user.$data.currentIndex = currentIndex;
        this.$alexaSkill.$audioPlayer.setOffsetInMilliseconds(0)
          .play(nextWord.url, `${currentIndex}`);
    },
    LoopOnIntent() {
        this.tell('Not implemented');
    },
    LoopOffIntent() {
        this.tell('Not implemented');
    },
    AUDIOPLAYER: {
        'AlexaSkill.PlaybackStarted'() {
            console.log('AlexaSkill.PlaybackStarted');
            currentToken = wordsData.wordData[currentIndex].title;
            this.$user.$data.currentUrl = wordsData.wordData[currentIndex].url;
        },

        'AlexaSkill.PlaybackNearlyFinished'() {
            console.log('AlexaSkill.PlaybackNearlyFinished');
            let currentIndex = this.$user.$data.currentIndex;
            let word = Fetcher.getNextWords(currentIndex);
            let nextIndex = Fetcher.getWordIndex(word);
            this.$alexaSkill.$audioPlayer
              .setExpectedPreviousToken(`${currentIndex}`)
              .enqueue(word.url, `${nextIndex}`);
        },

        'AlexaSkill.PlaybackFinished'() {
            console.log('AlexaSkill.PlaybackFinished');
            let currentIndex = this.$user.$data.currentIndex;
            this.$user.$data.currentIndex = Fetcher.updateIndex(currentIndex);
        },

        'AlexaSkill.PlaybackStopped'() {
            console.log('AlexaSkill.PlaybackStopped');
        },

        'AlexaSkill.PlaybackFailed'() {
            console.log('AlexaSkill.PlaybackFailed');
        }
    },
    PLAYBACKCONTROLLER: {
    'PlaybackController.PlayCommandIssued'() {
        console.log('PlaybackController.PlayCommandIssued');
    },

    'PlaybackController.NextCommandIssued'() {
        console.log('PlaybackController.NextCommandIssued');
    },

    'PlaybackController.PreviousCommandIssued'() {
        console.log('PlaybackController.PreviousCommandIssued');
    },

    'PlaybackController.PauseCommandIssued'() {
        console.log('PlaybackController.PauseCommandIssued');
    }
  },
});


module.exports.app = app;
