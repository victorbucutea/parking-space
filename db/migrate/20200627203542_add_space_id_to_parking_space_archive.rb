class AddSpaceIdToParkingSpaceArchive < ActiveRecord::Migration[5.2]
  def change
    add_column :parking_space_archives, :space_id, :bigint
  end
end
