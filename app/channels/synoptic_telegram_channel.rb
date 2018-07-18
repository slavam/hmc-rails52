class SynopticTelegramChannel < ApplicationCable::Channel
  def subscribed
    stream_from "synoptic_telegram_channel"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
