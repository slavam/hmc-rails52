class CandidateChannel < ApplicationCable::Channel
  def subscribed
    if connect_user.role == 'synoptic'
      stream_from "candidate_channel_user_#{connect_user.id}"
    end
    stream_from "candidate_channel"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
