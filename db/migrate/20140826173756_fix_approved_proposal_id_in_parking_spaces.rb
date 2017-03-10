class FixApprovedProposalIdInParkingSpaces < ActiveRecord::Migration
  def change
    remove_column :parking_spaces, :approved_proposal_id
    add_column   :parking_spaces, :approved_proposal_id, :numeric
  end
end
