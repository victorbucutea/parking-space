class AddLatLngToPerimeters < ActiveRecord::Migration[5.1]
  def change
    add_column :parking_perimeters, :lat, :decimal
    add_column :parking_perimeters, :lng, :decimal
  end
end
