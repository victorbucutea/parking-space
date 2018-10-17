json.extract! sensor_location, :id, :created_at,:parking_space_name, :name, :location_lat,
              :location_long, :address , :updated_at
json.url sensor_location_url(sensor_location, format: :json)
