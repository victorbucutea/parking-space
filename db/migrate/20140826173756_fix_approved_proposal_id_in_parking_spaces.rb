class FixApprovedProposalIdInParkingSpaces < ActiveRecord::Migration[4.2]
  def change
    change_column :parking_spaces, :approved_proposal_id, :long
  end
end
