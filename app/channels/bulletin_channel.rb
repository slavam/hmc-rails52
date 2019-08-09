class BulletinChannel < ApplicationCable::Channel
  def subscribed
    if connect_user.role == 'synoptic'
      stream_from "bulletin_editing_channel_user_#{connect_user.id}"
    end
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
