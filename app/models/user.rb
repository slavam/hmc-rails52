class User < ActiveRecord::Base
  ROLES = %w(admin vip technicist accountant synoptic agro hydro specialist user chemist observer railman spasatel guest hydroobserver)
  attr_accessor :remember_token
  validates :login, presence: true, length: { maximum: 50, minimum: 4 }, uniqueness: { case_sensitive: false }
  validates :last_name, presence: true, length: { maximum: 50 }
  validates :first_name, length: { maximum: 50 }
  validates :middle_name, length: { maximum: 50 }
  validates :role, :inclusion=> { :in => ROLES }
  has_secure_password
  validates :password, presence: true, length: { minimum: 4 }, :on => :create, allow_nil: true
  after_initialize :set_default_role, :if => :new_record?
  
  audited except: [:password_digest, :remember_digest],  allow_mass_assignment: true
  
  def full_name
    last_name+' '+first_name+' '+middle_name
  end

  def code_station
    if self.station_id.present? 
      return Station.find(self.station_id).code
    end
  end

  def set_default_role
    self.role ||= :user
  end
  
  def admin?
    self.role == 'admin'
  end
  
  def User.technicians
    User.where("role = 'technicist'")
  end
  
  # Returns the hash digest of the given string.
  def User.digest(string)
    cost = ActiveModel::SecurePassword.min_cost ? BCrypt::Engine::MIN_COST : BCrypt::Engine.cost
    BCrypt::Password.create(string, cost: cost)
  end
  
  # Returns a random token.
  def User.new_token
    SecureRandom.urlsafe_base64
  end
  
  # Remembers a user in the database for use in persistent sessions.
  def remember
    self.remember_token = User.new_token
    update_attribute(:remember_digest, User.digest(remember_token))
  end
  
  # Returns true if the given token matches the digest.
  def authenticated?(remember_token)
    return false if remember_digest.nil? # 20190819
    BCrypt::Password.new(remember_digest).is_password?(remember_token)
  end
  
  # Forgets a user.
  def forget
    update_attribute(:remember_digest, nil)
  end
  
  def User.fullname_by_lastname(lastname)
    user = User.find_by_last_name(lastname)
    user.present? ? user.full_name : ''
  end
end
