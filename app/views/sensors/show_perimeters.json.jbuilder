json.extract! @sensor, :id, :deviceid, :location_text, :title_message,
              :lat, :lng, :snapshot, :active,  :installation_date,
              :module_info, :top_left_x, :top_left_y, :hit_count, :created_at,
              :updated_at, :last_touch_date
json.perimeters do
  json.array! @sensor.parking_perimeters do |perimeter|
    if perimeter.parking_space?
      json.extract! perimeter, :id, :top_left_x, :top_left_y, :bottom_right_x,
                    :bottom_right_y, :identifier, :snapshot, :description,
                    :perimeter_type, :lat, :lng
      json.price perimeter.price.to_f unless perimeter.price.nil?
    end
  end
end


@sensor.parking_perimeters.each {|perimeter|
  if perimeter.sample_space?
    json.sample_perimeter do
      json.extract! perimeter, :id, :top_left_x, :top_left_y, :bottom_right_x,
                    :bottom_right_y, :identifier, :snapshot, :description,
                    :perimeter_type, :lat, :lng
    end
  end
}