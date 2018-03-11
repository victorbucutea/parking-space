class DeleteDeviceIdFromProposals < ActiveRecord::Migration[5.1]
  def change
    remove_column :proposals, :deviceid
    remove_column :parking_spaces, :deviceid
    remove_column :users, :device_id
  end
end
