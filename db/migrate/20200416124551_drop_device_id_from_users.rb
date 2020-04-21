class DropDeviceIdFromUsers < ActiveRecord::Migration[5.2]
  def change
    remove_column :users, :device_id
  end
end
