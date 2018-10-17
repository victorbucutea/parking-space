json.extract! @sensor, :id, :deviceid, :location_text, :title_message,
              :lat, :lng, :snapshot, :active, :hook_active, :installation_date,
              :module_info, :hit_count, :created_at, :updated_at
json.perimeters do
  json.array! @sensor.parking_perimeters do |perimeter|
    if perimeter.parking_space?
      json.extract! perimeter, :id, :top_left_x, :top_left_y, :bottom_right_x, :price,
                    :bottom_right_y, :identifier, :snapshot, :description, :perimeter_type

    end
  end
end


for perimeter in @sensor.parking_perimeters
  if perimeter.sample?
    json.sample_perimeter do
      json.extract! perimeter, :id, :top_left_x, :top_left_y, :bottom_right_x,
                    :bottom_right_y, :identifier, :snapshot, :description, :perimeter_type
    end
  end
end