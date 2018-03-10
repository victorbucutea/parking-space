class AddFkFromProposalsToUser < ActiveRecord::Migration[5.1]
  def change
    add_reference :proposals,:user, foreign_key: true
    # add_foreign_key :proposals, :users, index: true
  end
end
