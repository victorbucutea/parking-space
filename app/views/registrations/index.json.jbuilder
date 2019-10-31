json.array! @users do |user|
  json.extract! user, :full_name, :phone_number,
                :country, :email, :phone_no_confirm,
                :license
  json.roles do
    json.array! user.roles do |role|
      json.extract! role, :identifier
    end
  end
end