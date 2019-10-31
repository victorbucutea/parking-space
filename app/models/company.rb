class Company < ActiveRecord::Base
  has_many :locations

  # many roles ( and indirectly users ) can be company_admin
  has_many :roles
  has_many :users
  has_many :parking_spaces

end
