class Location < ActiveRecord::Base


  has_many :sections, :dependent => :destroy
  belongs_to :company
  belongs_to :city
  has_many :roles

end