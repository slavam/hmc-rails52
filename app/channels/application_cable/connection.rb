module ApplicationCable
  class Connection < ActionCable::Connection::Base
    include SessionsHelper

    identified_by :connect_user
    
    def connect
      self.connect_user = find_verified_user
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
end
