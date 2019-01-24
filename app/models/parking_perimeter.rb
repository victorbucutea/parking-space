class ParkingPerimeter < ActiveRecord::Base
  enum perimeter_type: %i[sample_space parking_space]

  belongs_to :sensor
  belongs_to :parking_space, :dependent => :destroy
  
end
