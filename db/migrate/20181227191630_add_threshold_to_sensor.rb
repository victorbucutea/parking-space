class AddThresholdToSensor < ActiveRecord::Migration[5.1]
  def change
    add_column :sensors, :correlation_threshold, :decimal
  end
end
