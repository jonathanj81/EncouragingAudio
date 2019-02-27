// ------------------------------------------------------------------
// APP CONFIGURATION
// ------------------------------------------------------------------

module.exports = {
    logging: true,

    intentMap: {
        'AMAZON.StopIntent': 'END',
        'AMAZON.PauseIntent': 'PauseIntent',
        'AMAZON.ResumeIntent': 'ResumeIntent',
        'AMAZON.StartOverIntent': 'StartOverIntent',
        'AMAZON.ShuffleOnIntent': 'ShuffleOnIntent',
        'AMAZON.ShuffleOffIntent': 'ShuffleOffIntent',
        'AMAZON.RepeatIntent': 'RepeatIntent',
        'AMAZON.PreviousIntent': 'PreviousIntent',
        'AMAZON.NextIntent': 'NextIntent',
        'AMAZON.LoopOnIntent': 'LoopOnIntent',
        'AMAZON.LoopOffIntent': 'LoopOffIntent',
    },

    db: {
         FileDb: {
             pathToFile: '../db/db.json',
         }
     },
 };
