json.extract! role, :id, :identifier

unless role.company.nil?
  json.company do
    json.extract! role.company, :name, :address, :short_name, :created_at
  end
end

unless role.location.nil?
  json.location do
    json.extract! role.location, :name, :address
  end
end

json.available_companies do
  #TODO get companies for which user is company_admin
  # maybe better in a different place ? get companies for user
end

json.available_locations do
  #TODO get locations for which user is company_admin or parking_lot_admin
  #   # maybe better in a different place ? get locations for user
end
