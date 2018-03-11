class ApprovalStatusInProposals < ActiveRecord::Migration[5.1]
  def change
    add_column :proposals, :approval_status, :integer
  end
end
