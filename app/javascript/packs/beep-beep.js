// where in production?
var snd = new Audio("/assets/ring1.wav");
App.candidate = App.cable.subscriptions.create({
        // channel: "CandidateChannel", 
        channel: "SynopticTelegramChannel",
      },
      {received: data => {
        if (data.sound)
          snd.play();
          // alert("Beep");
      }
    });