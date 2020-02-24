class AddStatusToParkingSpaces < ActiveRecord::Migration[5.2]
  def change
    add_column :parking_spaces, :status, :integer
  end
end
