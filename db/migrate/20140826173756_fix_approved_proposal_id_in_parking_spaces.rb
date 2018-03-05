class FixApprovedProposalIdInParkingSpaces < ActiveRecord::Migration[5.1]
  def change
    change_column :parking_spaces, :approved_proposal_id, :integer
  end
end
