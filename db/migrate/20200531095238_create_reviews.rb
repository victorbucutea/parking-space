class CreateReviews < ActiveRecord::Migration[5.2]
  def change
    create_table :reviews do |t|
      t.text :comment
      t.decimal :rating
      t.belongs_to :parking_space, foreign_key: true
      t.belongs_to :user, foreign_key: true
      t.string :owner_name

      t.timestamps
    end
  end
end
