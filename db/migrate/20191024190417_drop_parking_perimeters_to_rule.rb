class DropParkingPerimetersToRule < ActiveRecord::Migration[5.2]
  def change
    drop_join_table :parking_perimeters, :rules
  end
end
