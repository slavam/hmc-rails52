var snd = new Audio("/assets/ring1.wav");
App.candidate = App.cable.subscriptions.create({
    channel: "SynopticTelegramChannel",
  },{
  received: data => {
    if (data.sound){
      // let snd = new Audio("/assets/ring1.wav");
      snd.play();
      alert("Штормовая телеграмма! "+data.telegram.telegram);
    }
  }
});