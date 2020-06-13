json.array! @docs do |doc|
  json.extract! doc, :id, :file, :comment, :status, :created_at, :updated_at
end
