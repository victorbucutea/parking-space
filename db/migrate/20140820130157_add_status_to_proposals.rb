class AddStatusToProposals < ActiveRecord::Migration
  def change
    add_column :proposals, :status, :string
    add_column :proposals, :bidder_name, :string
  end
end
