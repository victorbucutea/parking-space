class RemoveTitleMessageFromProposal < ActiveRecord::Migration[5.2]
  def change
    remove_column :proposals, :title_message
  end
end
