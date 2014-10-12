class AddOwnerNameToParkingSpace < ActiveRecord::Migration
  def change
    add_column :parking_spaces, :owner_name, :string
  end
end
