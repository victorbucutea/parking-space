class Location < ActiveRecord::Base

  before_update :update_parking_spaces
  before_destroy :expire_parking_spaces

  has_many :sections, :dependent => :destroy
  belongs_to :company
  has_many :roles


  def update_parking_spaces
    sections.each do | section |
      section.parking_perimeters.each do |perim|
        parking_space = perim.parking_space
        perim.populate parking_space
        parking_space.save!
      end
    end
  end

  def expire_parking_spaces
    sections.each do | section |
      section.parking_perimeters.each do |perim|
        perim.expire_old_space
      end
    end
  end


end