class DropReadMessageFromProsal < ActiveRecord::Migration[5.2]
  def change
    remove_column :proposals, :read
    remove_column :proposals, :message_from_device_id
  end
end
