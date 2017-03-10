json.array!(@parameters) do |parameter|
  json.extract! parameter, :id, :name, :default_value
  json.values do
    json.array!(parameter.parameter_values) do |value|
      json.extract! value, :key, :value, :value2, :value3, :value4
    end
  end
  # json.url parameter_url(parameter, format: :json)
end
