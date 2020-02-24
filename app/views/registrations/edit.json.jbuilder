json.extract! current_user, :full_name, :phone_number, :country, :email,:phone_no_confirm, :license , :prefix
json.roles do
  json.array! current_user.roles do |role|
    json.extract! :identifier
  end
end