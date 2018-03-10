class FixOccupiedInParkingSpaces < ActiveRecord::Migration[5.1]
  def change
    rename_column :parking_spaces, :occupied, :approved_proposal_id
  end
end
