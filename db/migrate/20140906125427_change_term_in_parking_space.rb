class ChangeTermInParkingSpace < ActiveRecord::Migration[5.1]
  def change
    add_column :parking_spaces, :interval, :integer
  end
end
