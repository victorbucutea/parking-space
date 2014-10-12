class RemoveWinFlagFromProposals < ActiveRecord::Migration
  def change
    remove_column :proposals, :win_flag
  end
end
