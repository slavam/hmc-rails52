App.candidate = App.cable.subscriptions.create("CandidateChannel", {
  connected: function() {
    // Called when the subscription is ready for use on the server
  },

  disconnected: function() {
    // Called when the subscription has been terminated by the server
  },

  received: function(data) {
    // alert(data.message)
    // Called when there's incoming data on the websocket for this channel
  }
});
