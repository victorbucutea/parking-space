class Sensor < ActiveRecord::Base

  scope :for_location, ->(loc_id) {where('sensors.sensor_location_id = ? ', loc_id)}

  belongs_to :sensor_location
  has_many :parking_perimeters, :dependent => :destroy

  def increment_hit_count
    if hit_count.nil?
      self.hit_count = 0
    else
      self.hit_count = self.hit_count + 1
    end
  end

  def publish_spaces(params)

    for p in params[:free_perimeters]
      parking_perimeter = ParkingPerimeter.find(p[:id])
      sensor_location = parking_perimeter.sensor.sensor_location

      # it might be sensor wasn't assigned to a location
      next if sensor_location.nil?

      # delete existing published space and create a new one for each available perimeter
      parking_perimeter.parking_space.destroy unless parking_perimeter.parking_space.nil?

      if p[:available]
        parking_space = ParkingSpace.new
        parking_space.owner_name = 'n/a'
        parking_space.location_lat = sensor_location.location_lat
        parking_space.location_long = sensor_location.location_long
        parking_space.address_line_1 = sensor_location.address
        parking_space.target_price = parking_perimeter.price
        parking_space.target_price_currency = 'Ron'
        parking_space.source_type = 'sensor_source'
        parking_space.title = parking_perimeter.description
        parking_space.space_availability_start = DateTime.now
        parking_space.space_availability_stop = DateTime.now + 2.minutes
        parking_space.save!
        parking_perimeter.parking_space = parking_space
        parking_perimeter.save!
      end

    end

  end

end

