require 'rack/mime'


class ParkingSpace < ActiveRecord::Base
  include ActiveModel::Dirty

  enum legal_type: [:public_parking, :private_parking]
  scope :not_expired, -> {  where('parking_spaces.space_availability_stop >= ? ',Time.now)}
  scope :active, ->  { where('parking_spaces.space_availability_start <= ? ',Time.now )}
  scope :within_boundaries, -> (attrs) {
    where('parking_spaces.location_lat >= :lat_min
           AND parking_spaces.location_lat <= :lat_max
           AND parking_spaces.location_long >= :lon_min
           AND parking_spaces.location_long <= :lon_max', attrs)
  }

  has_many :proposals, :dependent => :destroy

  belongs_to :user

  validates :location_lat, :presence => true, numericality: {greater_than_or_equal_to: -90, less_than_or_equal_to: 90}
  validates :location_long, :presence => true, numericality: {greater_than_or_equal_to: -180, less_than_or_equal_to: 180}

  validates :address_line_1, :presence => true
  validates :title, :presence => true
  validates :target_price, :presence => true
  validates :target_price_currency, :presence => true
  validates :space_availability_start, :presence => true
  validates :space_availability_stop, :presence => true
  validate :availability_stops_after_start
  attr_accessor :owner

  after_initialize :init



  def availability_stops_after_start
    if self.space_availability_start > self.space_availability_stop
        self.errors.add(:space_availability_start, 'should be lower than stop')
    end
  end


  def init
    self.legal_type ||= :private_parking
  end

  def has_paid_proposals?
    self.proposals.each do |offer|
      if offer.end_date > DateTime.now && offer.paid?
        return true
      end
    end
    false
  end

  def expired?
    Time.now >= space_availability_stop
  end

end