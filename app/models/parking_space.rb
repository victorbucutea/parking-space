class ParkingSpace < DeviceRecord
  include ActiveModel::Dirty

  enum interval: [:long_term, :short_term]

  scope :long_term, -> { where('parking_spaces.interval = ? and parking_spaces.created_at >= ? ', ParkingSpace.intervals[:long_term], APP_CONFIG['long_term_expiration'].minutes.ago) }
  scope :short_term, -> { where('parking_spaces.interval = ? and parking_spaces.created_at >= ? ', ParkingSpace.intervals[:short_term], APP_CONFIG['short_term_expiration'].minutes.ago) }
  scope :within_boundaries, ->(attrs) {
    where('parking_spaces.location_lat >= :lat_min
           AND parking_spaces.location_lat <= :lat_max
           AND parking_spaces.location_long >= :lon_min
           AND parking_spaces.location_long <= :lon_max', attrs)
  }

  has_many :proposals

  validates :location_lat, :presence => true, numericality: {greater_than_or_equal_to: -90, less_than_or_equal_to: 90}
  validates :location_long, :presence => true, numericality: {greater_than_or_equal_to: -180, less_than_or_equal_to: 180}
  validates :recorded_from_lat, :presence => true
  validates :recorded_from_long, :presence => true

  attr_accessor :image_data

  before_save :save_image
  after_destroy :delete_image
  after_initialize :init


  def save_image
    if image_data.present?
      path = "#{Rails.root}/public/files/images/"
      FileUtils.mkdir_p(path) unless File.directory?(path)
      File.open(path + "#{owner_name}_standard_#{image_file_name}", 'wb') do |file|
        file.write(Base64.decode64(self.image_data))
      end
      self.standard_image_url = "/public/files/images/#{owner_name}_standard_#{image_file_name}"
      self.thumbnail_image_url = "/public/files/images/#{owner_name}_thumbnail_#{image_file_name}"
    end
  end

  def delete_image
    path = "#{Rails.root}/public/files/images/"
    File.delete(path+"#{owner_name}_standard_#{image_file_name}")
    File.delete(path+"#{owner_name}_thumbnail_#{image_file_name}")
  end

  def init
    self.interval ||= :short_term
  end
end