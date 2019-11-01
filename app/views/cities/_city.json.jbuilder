json.extract! city, :id, :name, :country, :size, :created_at, :updated_at
json.locations do
  json.array! city.locations do | loc|
    json.extract! loc , :name, :address
  end
end
json.url city_url(city, format: :json)
