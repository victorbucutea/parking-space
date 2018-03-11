class AddTypeToParkingSpace < ActiveRecord::Migration[5.1]
  def change
    add_column :parking_spaces, :type, :integer
  end
end
