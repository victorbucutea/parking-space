class DropStatusFromProposal < ActiveRecord::Migration[5.1]
  def change
    remove_column :proposals, :status
  end
end
