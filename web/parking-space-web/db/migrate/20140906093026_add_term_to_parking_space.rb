class AddTermToParkingSpace < ActiveRecord::Migration
  def change
    add_column :parking_spaces, :term, :string
  end
end
