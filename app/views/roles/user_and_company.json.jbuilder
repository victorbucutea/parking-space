json.company do
  unless @company.nil?
    json.extract! @company, :name, :short_name
    json.locations do
      json.array! @company.locations, partial: 'locations/location', as: :location
    end
  end
end
json.roles do
  json.array! @roles do |role|
    json.extract! role, :identifier
  end
end