json.array! @sensors do |sensor|
  json.extract! sensor, :id, :deviceid, :location_text, :title_message,
                :lat, :lng, :snapshot, :installation_date, :active,
                :module_info, :top_left_x, :top_left_y, :created_at, :updated_at, :last_touch_date
  unless sensor.last_touch_date.nil?
    json.is_connected sensor.last_touch_date.to_time > 3.minutes.ago
  end
  unless sensor.section.nil?
    json.section do
      json.extract! sensor.section, :id, :name
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
