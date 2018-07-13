class CandidateChannel < ApplicationCable::Channel
  def subscribed
    stream_from "candidate_channel"
    # stream_from "candidate_channel_user_#{message_user.id}"
    # technicians = User.technicians
    # technicians.each do |t|
    #   stream_from "room_channel_user_#{t.id}"
    # end
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
