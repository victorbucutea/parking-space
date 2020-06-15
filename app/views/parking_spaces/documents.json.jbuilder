json.array! @docs do |doc|
  json.extract! doc, :id, :file, :name, :comment, :status, :created_at, :updated_at
  json.type doc.resource_type
end
