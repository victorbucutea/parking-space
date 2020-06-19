json.array! @proposals do |p|
  json.extract! p, :id, :start_date, :end_date, :created_at
end
