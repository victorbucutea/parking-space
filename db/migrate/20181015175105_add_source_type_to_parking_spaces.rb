class AddSourceTypeToParkingSpaces < ActiveRecord::Migration[5.1]
  def change
    add_column :parking_spaces, :source_type, :integer, default: 0
  end
end
