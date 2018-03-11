class MakeDeviceIdUnique < ActiveRecord::Migration[5.1]
  def change
    add_index :users, [:device_id], :unique => true
  end
end
