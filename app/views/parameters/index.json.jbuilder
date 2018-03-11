json.array!(@parameters) do |parameter|
  json.extract! parameter, :id, :name, :default_value
  json.values do
    json.array!(parameter.parameter_values) do |value|
      json.extract! value, :key, :value, :value2, :value3, :value4
    end
  end
  #json.starting_currency (parameter.parameter_values.select{|s| s.key == parameter.default_value})
end
