prop = @proposals[0]
json.extract! prop, :id, :start_date, :end_date, :parking_space_id, :created_at
json.lat prop.parking_space.location_lat.to_f
json.lng prop.parking_space.location_long.to_f