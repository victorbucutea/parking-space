class AddPhoneNumberToProposals < ActiveRecord::Migration[5.1]
  def change
    add_column :proposals, :phone_number, :string
  end
end
