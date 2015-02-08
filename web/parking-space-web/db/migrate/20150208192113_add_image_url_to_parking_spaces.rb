class AddImageUrlToParkingSpaces < ActiveRecord::Migration
  def change
    add_column :parking_spaces, :thumbnail_image_url, :text
    add_column :parking_spaces, :standard_image_url, :text
  end
end
