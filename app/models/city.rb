class City < ActiveRecord::Base

  scope :created_in_last_min, -> () { where(" cities.created_at >=? ", 5.minutes.ago) }

  has_many :locations
end
