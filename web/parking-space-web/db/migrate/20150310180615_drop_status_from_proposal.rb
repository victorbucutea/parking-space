class DropStatusFromProposal < ActiveRecord::Migration
  def change
    remove_column :proposals, :status
  end
end
