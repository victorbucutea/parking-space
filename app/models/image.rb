class Image < ActiveRecord::Base

  belongs_to :parking_space
  belongs_to :user

end
