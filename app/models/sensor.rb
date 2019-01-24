class Sensor < ActiveRecord::Base

  scope :for_location, ->(loc_id) {where('sensors.sensor_location_id = ? ', loc_id)}

  belongs_to :sensor_location
  has_many :parking_perimeters, :dependent => :destroy

  def do_heartbeat
    self.hit_count = self.hit_count.nil? ? 0 : self.hit_count + 1
    if self.hook_active
      self.console_hit_count = self.console_hit_count.nil? ? 0 : self.console_hit_count + 1

      if self.console_hit_count > 20 # 20 cycles (30s * 20 = 600s = 10m)
        self.hook_active = false
        self.console_hit_count = 0
      end
    end
    self.last_touch_date = DateTime.now
    save
  end

  def publish_spaces(params)

    params[:free_perimeters].each do |p|
      parking_perimeter = ParkingPerimeter.find(p[:id])
      sensor_location = parking_perimeter.sensor.sensor_location
      next if sensor_location.nil?

      is_free = p[:evaluatedCorrelation] > parking_perimeter.correlation_threshold

      next unless is_free

      parking_space = parking_perimeter.parking_space || ParkingSpace.new
      parking_space.owner_name = 'n/a'
      parking_space.location_lat = parking_perimeter.lat
      parking_space.location_long = parking_perimeter.lng
      parking_space.address_line_1 = sensor_location.address
      parking_space.target_price = parking_perimeter.price
      parking_space.target_price_currency = 'Ron'
      parking_space.source_type = 'sensor_source'
      parking_space.title = parking_perimeter.description
      parking_space.space_availability_start = DateTime.now
      parking_space.space_availability_stop = DateTime.now + 3.minutes
      parking_space.save!
      parking_perimeter.parking_space = parking_space
      parking_perimeter.save!
    end

  end

end

