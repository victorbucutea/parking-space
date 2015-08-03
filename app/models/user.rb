class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  before_create :generate_device_id


  def generate_device_id
    phone_number = self.phone_number || ''
    email = self.email || ''
    full_name = self.full_name || ''
    user_uuid = phone_number + '_'+email + '_' +  full_name
    crypt = ActiveSupport::MessageEncryptor.new(Rails.application.secrets.secret_key_base)
    encrypted_data = crypt.encrypt_and_sign(user_uuid)
    self.device_id = encrypted_data
  end


end
