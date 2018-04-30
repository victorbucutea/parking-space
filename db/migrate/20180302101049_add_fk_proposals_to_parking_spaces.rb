class AddFkProposalsToParkingSpaces < ActiveRecord::Migration[5.1]
  def change
    add_foreign_key :proposals, :parking_spaces, index: true
  end
end
