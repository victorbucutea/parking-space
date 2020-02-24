class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable, :recoverable,
         :rememberable, :trackable, :validatable , :lockable

  scope :with_name, -> (desc) { where('users.full_name like ?
                                      or users.email like ? ',"%#{desc}%", "%#{desc}%")}

  scope :for_companies, -> (c) { joins(:company).where("companies.id in  (?) ",c)}

  attr_accessor :skip_password_validation

  has_one :account
  belongs_to :company
  has_many :parking_spaces
  has_many :roles


  def password_required?
     false
  end

  def company_admin
    company_role = nil
    roles.each do |r|
      company_role = r if r.identifier == 'company_admin'
    end
    company_role.company unless company_role.nil?
  end


  def has_role(role)
    roles.each do |r|
      return true if r.identifier == role
    end
    false
  end


end
