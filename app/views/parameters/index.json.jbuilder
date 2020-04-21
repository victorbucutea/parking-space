@parameters.each do |parameter|
  if parameter.name == 'country'
    json.default_country parameter.default_value
    json.countries do
      ctries = parameter.parameter_values.sort_by(&:value4)
      ctries.each do | par_val|
        json.set! par_val.key do
          json.currency  par_val.value2
          json.prefix  par_val.value3
          json.name  par_val.value4
          json.mobile_prefixes  par_val.value5
          json.mobile_no_length  par_val.value6
          json.mobile_example  par_val.value7
          json.starting_value par_val.value
          json.code par_val.key
        end
      end
    end
  else
    # json.values do
    #   json.array!(parameter.parameter_values) do |value|
    #     json.values value
    #   end
    # end
  end
end
