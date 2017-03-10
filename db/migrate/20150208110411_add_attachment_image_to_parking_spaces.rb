class AddAttachmentImageToParkingSpaces < ActiveRecord::Migration
  def self.up
      add_column :parking_spaces , :image_file_name, :text
      add_column :parking_spaces ,:image_content_type, :text
      add_column :parking_spaces ,:image_file_size, :integer
  end

  def self.down
    remove_column :parking_spaces , :image_file_name
    remove_column :parking_spaces ,:image_content_type
    remove_column :parking_spaces ,:image_file_size
  end
end
