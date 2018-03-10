class AddOwnerNameToParkingSpace < ActiveRecord::Migration[5.1]
  def change
    add_column :parking_spaces, :owner_name, :string
  end
end
