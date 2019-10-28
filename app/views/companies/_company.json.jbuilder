json.extract! company, :id, :name, :cui, :address, :short_name,:registry,  :created_at, :updated_at
json.url company_url(company, format: :json)
