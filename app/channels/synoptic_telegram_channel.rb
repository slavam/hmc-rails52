class SynopticTelegramChannel < ApplicationCable::Channel
  def subscribed
    stream_from "synoptic_telegram_channel"
    if (connect_user.role == 'synoptic') or (connect_user.role == 'vip')
      # stream_from "storm_telegram_created" 20190724
      stream_from "storm_telegram_user_#{connect_user.id}" 
    end

  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
    stop_all_streams
  end
end
