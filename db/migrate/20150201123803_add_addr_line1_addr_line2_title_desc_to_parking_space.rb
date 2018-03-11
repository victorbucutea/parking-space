class AddAddrLine1AddrLine2TitleDescToParkingSpace < ActiveRecord::Migration[5.1]
  def change
    add_column :parking_spaces, :address_line_1, :string
    add_column :parking_spaces, :address_line_2, :string
    add_column :parking_spaces, :title, :string
    add_column :parking_spaces, :description, :string
  end
end
