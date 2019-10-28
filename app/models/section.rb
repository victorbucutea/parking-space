class Section  < ActiveRecord::Base

  has_many :sensors
  has_many :parking_perimeters
end
