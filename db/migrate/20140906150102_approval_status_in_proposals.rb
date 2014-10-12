class ApprovalStatusInProposals < ActiveRecord::Migration
  def change
    add_column :proposals, :approval_status, :integer
  end
end
