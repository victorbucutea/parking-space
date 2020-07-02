class AddCreatedByToParkingSpaceArchive < ActiveRecord::Migration[5.2]
  def change
    add_column :parking_space_archives, :created_by, :string
  end
end
