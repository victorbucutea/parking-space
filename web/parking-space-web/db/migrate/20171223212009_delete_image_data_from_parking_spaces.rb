class DeleteImageDataFromParkingSpaces < ActiveRecord::Migration[5.1]
  def change
    remove_column :parking_spaces, :image_file_name, :string
    remove_column :parking_spaces, :image_content_type, :string
    remove_column :parking_spaces, :image_file_size, :string
    remove_column :parking_spaces, :thumbnail_image_url, :string
    remove_column :parking_spaces, :standard_image_url, :string
    remove_column :parking_spaces, :rotation_angle, :string
  end
end
