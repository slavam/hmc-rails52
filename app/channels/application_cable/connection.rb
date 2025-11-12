module ApplicationCable
  class Connection < ActionCable::Connection::Base
    include SessionsHelper

    identified_by :connect_user
    
    def connect
      Rails.logger.info "Websocked connected for user #{current_user&.id}"
      self.connect_user = find_verified_user
    end

    def disconnect
      Rails.logger.info "Websocked disconnected for user #{current_user&.id}"
    end

    private

    def find_verified_user
      if logged_in?
        current_user
      else
        reject_unauthorized_connection
      end
    end
  end
  # class Connection < ActionCable::Connection::Base
  #   include SessionsHelper
  #   identified_by :current_user

  #   def connect
  #     session = cookies.encrypted['_session']
  #     user_id = session['user_id'] if session.present?

  #     self.current_user = (user_id.present? && User.find_by(id: user_id))

  #     reject_unauthorized_connection unless current_user
  #   end
  # end
end
