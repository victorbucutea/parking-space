class FixOccupiedInParkingSpaces < ActiveRecord::Migration
  def change
    rename_column :parking_spaces, :occupied, :approved_proposal_id
  end
end
