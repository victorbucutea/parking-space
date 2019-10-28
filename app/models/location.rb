class Location < ActiveRecord::Base


  has_many :sections
  belongs_to :company

end