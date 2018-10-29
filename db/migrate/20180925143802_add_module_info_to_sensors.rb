class AddModuleInfoToSensors < ActiveRecord::Migration[5.1]
  def change
    add_column :sensors, :module_info, :string
  end
end
