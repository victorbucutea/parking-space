class ParkingPerimeter < ActiveRecord::Base
  enum perimeter_type: [:sample, :parking_space]

  belongs_to :sensor
  belongs_to :parking_space, :dependent => :destroy
end
