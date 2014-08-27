class ParkingSpace  < DeviceRecord
  include ActiveModel::Dirty

  scope :short_term , -> { where('created_at >= ? ', 5.minutes.ago) }
  scope :within_boundaries, ->(attrs) {short_term.where('location_lat >= :lat_min AND location_lat <= :lat_max
                                          AND location_long  >= :lon_min AND location_long <= :lon_max', attrs)}
  has_many :proposals

  validates :location_lat, :presence => true, numericality: { greater_than_or_equal_to: -90, less_than_or_equal_to: 90}
  validates :location_long, :presence => true, numericality: { greater_than_or_equal_to: -180, less_than_or_equal_to: 180}
  validates :recorded_from_lat, :presence => true
  validates :recorded_from_long, :presence => true

end