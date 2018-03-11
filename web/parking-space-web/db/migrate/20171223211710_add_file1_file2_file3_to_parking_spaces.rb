class AddFile1File2File3ToParkingSpaces < ActiveRecord::Migration[5.1]
  def change
    add_column :parking_spaces, :file1, :string
    add_column :parking_spaces, :file2, :string
    add_column :parking_spaces, :file3, :string
  end
end
