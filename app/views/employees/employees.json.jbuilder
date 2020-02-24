json.array! @users do |user|
  json.extract! user, :id, :email, :full_name, :phone_number
end
