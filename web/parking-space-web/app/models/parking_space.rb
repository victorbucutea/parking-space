class ParkingSpace < DeviceRecord
  include ActiveModel::Dirty

  enum interval: [:long_term, :short_term]

  scope :long_term, -> { where('interval = ? and created_at >= ? ', ParkingSpace.intervals[:long_term], APP_CONFIG['long_term_expiration'].minutes.ago) }
  scope :short_term, -> { where('interval = ? and created_at >= ? ',  ParkingSpace.intervals[:short_term], APP_CONFIG['short_term_expiration'].minutes.ago) }

  scope :within_boundaries, ->(attrs) {
    where('location_lat >= :lat_min
           AND location_lat <= :lat_max
           AND location_long >= :lon_min
           AND location_long <= :lon_max', attrs)
  }

  has_many :proposals

  validates :location_lat, :presence => true, numericality: {greater_than_or_equal_to: -90, less_than_or_equal_to: 90}
  validates :location_long, :presence => true, numericality: {greater_than_or_equal_to: -180, less_than_or_equal_to: 180}
  validates :recorded_from_lat, :presence => true
  validates :recorded_from_long, :presence => true


  after_initialize :init

  def init
    self.interval ||= :short_term
  end


end