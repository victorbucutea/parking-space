json.extract! location, :id, :created_at, :parking_space_name, :name, :location_lat,
              :location_long, :address, :updated_at
json.sections do
  json.array! location.sections, partial: "sections/section", as: :section
end

json.url location_url(location, format: :json)
