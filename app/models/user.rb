class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable, :recoverable,
         :rememberable, :trackable, :validatable, :lockable

  scope :with_name, -> (desc) { where('users.full_name like ?
                                      or users.email like ? ', "%#{desc}%", "%#{desc}%") }

  scope :for_companies, -> (c) { joins(:company).where('companies.id in  (?) ', c) }

  attr_accessor :skip_password_validation

  has_one :account
  belongs_to :company
  has_many :parking_spaces
  has_many :roles
  has_many :images
  validate :phone_number_format


  def password_required?
    false
  end

  def role?(role)
    roles.each do |r|
      return true if r.identifier == role
    end
    false
  end

  def phone_with_prefix
    prefix + phone_number
  end

  def timezone
    ctry = country.nil? ? 'RO' : country.upcase
    TZInfo::Country.get(ctry).zone_info.first.timezone
  end

  def phone_number_format
    return if phone_number.nil?

    ctry = ParameterValue.find_by_key country
    format = ctry.value7
    prefix_ok = false

    ctry.value5.split(',').each do |prefix|
      prefix_ok = phone_number.start_with? prefix
      break if prefix_ok
    end
    format_p = Regexp.new format.gsub /\d ?/, '\\d'
    format_ok = format_p.match? phone_number

    prefix_ok && format_ok
  end

end
