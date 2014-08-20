json.array!(@parking_spaces) do |parking_space|
  json.extract! parking_space, :id, :location_lat, :location_long, :recorded_from_lat, :recorded_from_long, :created_at, :updated_at
  #json.url parking_space_url(parking_space, format: :json)
end
