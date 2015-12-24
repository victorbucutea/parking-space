class MakeDeviceIdUnique < ActiveRecord::Migration
  def change
    add_index :users, [:device_id], :unique => true
  end
end
