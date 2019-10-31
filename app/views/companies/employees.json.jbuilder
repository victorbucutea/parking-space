json.array! @companies do |comp|

  json.extract! comp, :id, :name, :cui, :address, :short_name, :registry, :created_at, :updated_at
  json.roles do
    json.array! comp.roles do |r|
      json.extract! r, :identifier, :id
      json.user do
        json.extract! r.user, :email, :full_name
      end
    end
  end
end
