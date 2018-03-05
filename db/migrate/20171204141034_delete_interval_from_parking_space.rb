class DeleteIntervalFromParkingSpace < ActiveRecord::Migration[5.1]
  def change
    remove_column :parking_spaces, :interval

  end
end
