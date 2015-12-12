class Parameter < ActiveRecord::Base

  has_many :parameter_values

  validates :name, :presence => true
  validates :default_value, :presence => true

end
