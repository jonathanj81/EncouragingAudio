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

app.setHandler({
    LAUNCH() {
        return this.toIntent('PlayIntent');
    },
    PlayIntent() {
        this.tell("Welcome to encouraging word. For today's words, say play today's words. For tomorrow's words, say play tomorrow's words. For yesterday's words, say play yesterday's words.");
    },
    PlayTodayIntent() {
        this.$alexaSkill.$audioPlayer
            .setOffsetInMilliseconds(0)
            .play(wordsData.wordData[1].url, 'today')
            .tell('English words');
    },
    PlayTomorrowIntent() {
        this.$alexaSkill.$audioPlayer
            .setOffsetInMilliseconds(0)
            .play(wordsData.wordData[2].url, 'tomorrow')
            .tell('Spanish words');
    },
    PlayYesterdayIntent() {
        this.$alexaSkill.$audioPlayer
            .setOffsetInMilliseconds(0)
            .play(wordsData.wordData[0].url, 'yesterday')
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
        },

        'AlexaSkill.PlaybackNearlyFinished'() {
            console.log('AlexaSkill.PlaybackNearlyFinished');
        },

        'AlexaSkill.PlaybackFinished'() {
            console.log('AlexaSkill.PlaybackFinished');
            this.$alexaSkill.$audioPlayer.stop();
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
