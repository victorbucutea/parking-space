class AddMessagedFromDeviceIdToProposals < ActiveRecord::Migration
  def change
    add_column :proposals, :message_from_device_id, :string
  end
end
