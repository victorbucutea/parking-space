class Proposal < ActiveRecord::Base

  belongs_to :parking_space
  has_many :messages

end
