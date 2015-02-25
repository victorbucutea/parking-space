class AddRotationAngleToParkingSpace < ActiveRecord::Migration
  def change
    add_column :parking_spaces, :rotation_angle, :decimal
  end
end
