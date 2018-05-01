class DeleteDeviceIdFromProposals < ActiveRecord::Migration[5.1]
  def change
    remove_column :proposals, :deviceid
    remove_column :parking_spaces, :deviceid
  end
end
