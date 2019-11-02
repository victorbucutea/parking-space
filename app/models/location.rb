class Location < ActiveRecord::Base


  has_many :sections, :dependent => :destroy
  belongs_to :company
  has_many :roles

end