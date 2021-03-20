class ParkingPerimeter < ActiveRecord::Base
  include ActiveModel::Dirty

  enum perimeter_type: %i[assigned_space employee_space public_space]

  belongs_to :sensor
  belongs_to :parking_space
  belongs_to :section
  belongs_to :user

  before_destroy :expire_old_space
  after_update :update_parking_space
  after_create :publish_parking_space


  def publish_parking_space
    parking_space = ParkingSpace.new
    populate parking_space
    parking_space.space_availability_start = DateTime.now
    parking_space.save!
    self.parking_space = parking_space
    save!
  end

  def update_parking_space
    unless previous_changes[:perimeter_type].nil?
      expire_old_space
    end
    populate parking_space
    parking_space.save!
  end

  def expire_old_space
    return if parking_space.nil?

    parking_space.space_availability_stop = DateTime.now
    parking_space.proposals.active_or_future.each do |prop|
      prop.end_date = DateTime.now
      prop.save
    end
    parking_space.save
  end

  def populate(parking_space)
    section_location = section.location
    return if section_location.nil?

    parking_space.owner_name = section_location.company.short_name
    parking_space.location_lat = section_location.location_lat
    parking_space.location_long = section_location.location_long
    parking_space.target_price = '0'
    parking_space.target_price_currency = 'Ron'
    parking_space.address_line_1 = section_location.address
    parking_space.source_type = 'company_source'
    parking_space.title = identifier
    parking_space.company_id = section_location.company.id
  end
end
