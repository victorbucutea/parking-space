json.extract! user, :full_name, :phone_number, :country, :email,
              :phone_no_confirm, :license, :prefix

json.images do
  json.array! user.images do |img|
    json.name img.name
    json.file img.image
  end
end
json.roles do
  json.array! user.roles do |role|
    json.extract! role, :identifier
  end
end