class AddFkToParkingPerimeters < ActiveRecord::Migration[5.1]
  def change

    add_reference :parking_perimeters, :sensors, index: true
    add_foreign_key :parking_perimeters, :sensors
  end
end
