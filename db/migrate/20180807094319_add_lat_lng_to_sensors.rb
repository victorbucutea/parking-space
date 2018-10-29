class AddLatLngToSensors < ActiveRecord::Migration[5.1]
  def change
    add_column :sensors, :lat, :decimal
    add_column :sensors, :lng, :decimal
  end
end
