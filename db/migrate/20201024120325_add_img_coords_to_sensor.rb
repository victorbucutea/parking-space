class AddImgCoordsToSensor < ActiveRecord::Migration[5.2]
  def change
    add_column :sensors, :top_left_x, :decimal
    add_column :sensors, :top_left_y, :decimal
    add_column :sensors, :bottom_right_x, :decimal
    add_column :sensors, :bottom_right_y, :decimal
  end
end
