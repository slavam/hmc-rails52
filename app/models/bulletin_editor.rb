class BulletinEditor < ApplicationRecord
  belongs_to :user
  belongs_to :bulletin
end
