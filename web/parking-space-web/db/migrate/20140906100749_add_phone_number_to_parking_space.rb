class AddPhoneNumberToParkingSpace < ActiveRecord::Migration[5.1]
  def change
    add_column :parking_spaces, :phone_number, :string
  end
end
