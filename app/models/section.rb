class Section < ActiveRecord::Base

  belongs_to :location
  has_many :sensors
  has_many :parking_perimeters, dependent: :destroy

end
