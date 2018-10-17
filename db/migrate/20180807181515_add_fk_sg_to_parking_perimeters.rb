class AddFkSgToParkingPerimeters < ActiveRecord::Migration[5.1]
  def change
    rename_column :parking_perimeters, :sensors_id, :sensor_id
  end
end
