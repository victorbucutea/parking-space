class Role < ActiveRecord::Base

  belongs_to :user
  belongs_to :company
  belongs_to :location

end