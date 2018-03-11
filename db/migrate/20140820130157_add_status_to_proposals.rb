class AddStatusToProposals < ActiveRecord::Migration[5.1]
  def change
    add_column :proposals, :status, :string
    add_column :proposals, :bidder_name, :string
  end
end
