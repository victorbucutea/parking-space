json.array! @sensors do |sensor|
  json.extract! sensor, :id, :deviceid, :location_text, :title_message,
                :lat, :lng, :snapshot, :installation_date, :hook_active, :active,
                :module_info, :created_at, :updated_at
  unless sensor.sensor_location.nil?
    json.sensor_location do
      json.extract! sensor.sensor_location, :id, :parking_space_name, :address, :name
    end
  end
  unless sensor.parking_perimeters.nil?
    json.perimeters do
      json.array! sensor.parking_perimeters do |perim|
        json.extract! perim, :id, :snapshot, :identifier, :description, :price
        unless perim.parking_space.nil?
          json.parking_space do
            json.extract! perim.parking_space, :id, :title
          end
        end
      end
    end
  end
end
