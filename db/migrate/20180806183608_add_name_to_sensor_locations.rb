class AddNameToSensorLocations < ActiveRecord::Migration[5.1]
  def change
    add_column :sensor_locations, :name, :string
  end
end
