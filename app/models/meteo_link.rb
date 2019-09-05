class MeteoLink < ActiveRecord::Base
  belongs_to :user
  belongs_to :user_menu
  # validates :address, :format => URI::regexp(%w(http https))
end
