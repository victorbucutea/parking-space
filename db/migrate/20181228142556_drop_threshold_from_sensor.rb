class DropThresholdFromSensor < ActiveRecord::Migration[5.2]
  def change
    remove_column :sensors, :correlation_threshold
    add_column :parking_perimeters, :correlation_threshold, :decimal
  end
end
