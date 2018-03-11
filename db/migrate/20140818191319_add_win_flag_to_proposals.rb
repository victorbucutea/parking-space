class AddWinFlagToProposals < ActiveRecord::Migration[5.1]
  def change
    add_column :proposals, :win_flag, :boolean
  end
end
