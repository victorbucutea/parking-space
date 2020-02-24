json.extract! @section, :id, :name, :description, :interior_map, :created_at, :updated_at
json.perimeters do
  json.array! @section.parking_perimeters do |perimeter|
    json.extract! perimeter, :id, :top_left_x, :top_left_y, :bottom_right_x,
                  :bottom_right_y, :identifier, :snapshot, :description,
                  :perimeter_type, :lat, :lng, :rules_expression, :user_id
    json.price perimeter.price.to_f unless perimeter.price.nil?
    json.is_public perimeter.public_space?
    json.is_assigned perimeter.assigned_space?
    json.is_employee perimeter.employee_space?
  end
end
json.perimeter_types do
  json.merge! [
      {name: ParkingPerimeter.perimeter_types.keys[0], idx: 0},
      {name: ParkingPerimeter.perimeter_types.keys[1], idx: 1},
      {name: ParkingPerimeter.perimeter_types.keys[2], idx: 2},
              ]
end