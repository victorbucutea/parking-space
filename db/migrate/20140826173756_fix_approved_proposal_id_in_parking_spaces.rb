class FixApprovedProposalIdInParkingSpaces < ActiveRecord::Migration
  def change
    change_column :parking_spaces, :approved_proposal_id, :long
  end
end
