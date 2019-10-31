require 'rack/mime'


class ParkingSpace < ActiveRecord::Base
  include ActiveModel::Dirty

  enum legal_type: [:public_parking, :private_parking]
  enum source_type: [:user_source, :sensor_source, :company_source]
  scope :not_expired, -> {
    where('parking_spaces.space_availability_stop >= ?
           or parking_spaces.space_availability_stop is null  ', Time.now) }
  scope :active, -> { where('parking_spaces.space_availability_start <= ? ', Time.now) }
  scope :within_boundaries, -> (attrs) {
    where('parking_spaces.location_lat >= :lat_min
           AND parking_spaces.location_lat <= :lat_max
           AND parking_spaces.location_long >= :lon_min
           AND parking_spaces.location_long <= :lon_max', attrs)
  }


  scope :for_company, -> (c) { where(' parking_spaces. company_id = ?', c) }

  has_many :proposals, :dependent => :destroy
  has_one :parking_perimeter

  belongs_to :user
  belongs_to :company

  validates :location_lat, :presence => true, numericality: {greater_than_or_equal_to: -90, less_than_or_equal_to: 90}
  validates :location_long, :presence => true, numericality: {greater_than_or_equal_to: -180, less_than_or_equal_to: 180}

  validates :address_line_1, :presence => true
  validates :title, :presence => true
  validates :target_price, :presence => true
  validates :target_price_currency, :presence => true
  validates :space_availability_start, :presence => true
  validate :availability_stops_after_start
  attr_accessor :owner

  after_initialize :init


  def availability_stops_after_start
    return if space_availability_stop.nil?
    if space_availability_start > space_availability_stop
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
    space_availability_stop.nil? or Time.now >= space_availability_stop
  end

end