class AddTypeToParkingPerimeters < ActiveRecord::Migration[5.1]
  def change
    add_column :parking_perimeters, :type, :integer
  end
end
