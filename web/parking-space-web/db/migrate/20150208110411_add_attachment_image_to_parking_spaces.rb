class AddAttachmentImageToParkingSpaces < ActiveRecord::Migration
  def self.up
    change_table :parking_spaces do |t|
      t.attachment :image
    end
  end

  def self.down
    remove_attachment :parking_spaces, :image
  end
end
