class DropBottomCoordsFromSensors < ActiveRecord::Migration[5.2]
  def change
    remove_column :sensors, :bottom_right_x
    remove_column :sensors, :bottom_right_y
  end
end
