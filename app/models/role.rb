class Role < ActiveRecord::Base

  has_one :user
  belongs_to :company
  belongs_to :location

end