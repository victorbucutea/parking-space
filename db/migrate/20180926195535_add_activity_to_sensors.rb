class AddActivityToSensors < ActiveRecord::Migration[5.1]
  def change
    add_column :sensors, :active, :boolean
    add_column :sensors, :hook_active, :boolean
  end
end
