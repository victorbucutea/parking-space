class DeleteFileFromParkingSpaces < ActiveRecord::Migration[5.2]
  def change
    remove_column :parking_spaces, :file1
    remove_column :parking_spaces, :file2
    remove_column :parking_spaces, :file3
  end
end
