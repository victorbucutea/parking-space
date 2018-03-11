class AddRotationAngleToParkingSpace < ActiveRecord::Migration[5.1]
  def change
    add_column :parking_spaces, :rotation_angle, :decimal
  end
end
