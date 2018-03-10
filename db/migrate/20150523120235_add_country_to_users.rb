class AddCountryToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :country, :text
  end
end
