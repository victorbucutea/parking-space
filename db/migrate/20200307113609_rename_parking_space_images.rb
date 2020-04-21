class RenameParkingSpaceImages < ActiveRecord::Migration[5.2]
  def change
    rename_table :parking_space_images, :images
  end
end
