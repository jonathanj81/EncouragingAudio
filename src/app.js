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

const wordsData = require('./wordsData');
var currentIndex = 1;
var currentToken = "";

app.setHandler({
    LAUNCH() {
        return this.toIntent('PlayIntent');
    },
    PlayIntent() {
        this.tell("Welcome to encouraging word. For today's words, say play today's words. For tomorrow's words, say play tomorrow's words. For yesterday's words, say play yesterday's words.");
    },
    PlayTodayIntent() {
      currentIndex = 1;
      currentToken = wordsData.wordData[1].title;
        this.$alexaSkill.$audioPlayer
            .setOffsetInMilliseconds(0)
            .play(wordsData.wordData[1].url, currentToken)
            .tell('English words');
    },
    PlayTomorrowIntent() {
      currentIndex = 2;
      currentToken = wordsData.wordData[2].title;
        this.$alexaSkill.$audioPlayer
            .setOffsetInMilliseconds(0)
            .play(wordsData.wordData[2].url, currentToken)
            .tell('Spanish words');
    },
    PlayYesterdayIntent() {
      currentIndex = 0;
      currentToken = wordsData.wordData[0].title;
        this.$alexaSkill.$audioPlayer
            .setOffsetInMilliseconds(0)
            .play(wordsData.wordData[0].url, wordsData.wordData[0].title)
            .tell('Chinese words');
    },
    PauseIntent() {
        this.$alexaSkill.$audioPlayer.stop();

        // Save offset to database
        this.$user.$data.offset = this.$alexaSkill.$audioPlayer.getOffsetInMilliseconds();
        this.tell('Paused!');
    },
    ResumeIntent() {
        this.$alexaSkill.$audioPlayer
            .setOffsetInMilliseconds(this.$user.$data.offset)
            .play(song, 'token')
            .tell('Resuming!');
    },
    AUDIOPLAYER: {
        'AlexaSkill.PlaybackStarted'() {
            console.log('AlexaSkill.PlaybackStarted');
            currentToken = wordsData.wordData[currentIndex].title;
        },

        'AlexaSkill.PlaybackNearlyFinished'() {
            console.log('AlexaSkill.PlaybackNearlyFinished');
            currentIndex = currentIndex < 2 ? ++currentIndex : 0;
            this.$alexaSkill.$audioPlayer
              .setExpectedPreviousToken(currentToken)
              .enqueue(wordsData.wordData[currentIndex].url, wordsData.wordData[currentIndex].title);
        },

        'AlexaSkill.PlaybackFinished'() {
            console.log('AlexaSkill.PlaybackFinished');
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
