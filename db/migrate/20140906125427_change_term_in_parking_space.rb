class ChangeTermInParkingSpace < ActiveRecord::Migration
  def change
    add_column :parking_spaces, :interval, :integer
  end
end
