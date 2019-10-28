class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  scope :with_query, -> (desc) { where('users.full_name like ?
                                      or users.email like ? ',"%#{desc}%", "%#{desc}%")}

  attr_accessor :skip_password_validation

  has_one :account
  has_many :parking_spaces
  has_many :roles


  def password_required?
    return false;
  end


end
