json.extract! user, :full_name, :phone_number, :country, :email,
              :phone_no_confirm, :license, :prefix
unless user.image.nil?
  json.image do
    json.name user.image
    json.image user.image
  end
end
json.roles do
  json.array! user.roles do |role|
    json.extract! role, :identifier
  end
end