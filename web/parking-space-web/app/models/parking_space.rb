require 'rack/mime'


class ParkingSpace < DeviceRecord
  include ActiveModel::Dirty

  enum interval: [:long_term, :short_term]
  scope :not_expired, -> { where('parking_spaces.space_availability_stop >= ? ', Time.now )}
  scope :active, -> { where('parking_spaces.space_availability_start <= ? ', Time.now )}
  scope :within_boundaries, ->(attrs) {
    where('parking_spaces.location_lat >= :lat_min
           AND parking_spaces.location_lat <= :lat_max
           AND parking_spaces.location_long >= :lon_min
           AND parking_spaces.location_long <= :lon_max', attrs)
  }

  has_many :proposals, :dependent => :destroy

  validates :location_lat, :presence => true, numericality: {greater_than_or_equal_to: -90, less_than_or_equal_to: 90}
  validates :location_long, :presence => true, numericality: {greater_than_or_equal_to: -180, less_than_or_equal_to: 180}

  validates :address_line_1, :presence => true
  validates :title, :presence => true
  validates :target_price, :presence => true
  validates :target_price_currency, :presence => true
  validates :space_availability_start, :presence => true
  validates :space_availability_stop, :presence => true
  validate :availability_stops_after_start

  attr_accessor :image_data
  attr_accessor :thumbnail_data

  before_save :save_image_and_thumbnail
  after_destroy :delete_image
  after_initialize :init


  def save_image_and_thumbnail
    if image_data.present?
      path = "#{Rails.root}/public/files/images/"
      FileUtils.mkdir_p(path) unless File.directory?(path)

      extension = Rack::Mime::MIME_TYPES.invert[image_content_type]

      light_deviceid = Time.now.to_i.to_s + "_" + self.deviceid[0..10]

      standard_name = "#{light_deviceid}_standard#{extension}"
      thumbnail_name = "#{light_deviceid}_thumbnail#{extension}"
      File.open(path + standard_name, 'wb') do |file|
        file.write(Base64.decode64(self.image_data[22..-1]))
      end

      File.open(path + thumbnail_name, 'wb') do |file|
        file.write(Base64.decode64(self.thumbnail_data[22..-1])) if thumbnail_data.present?
      end

      self.standard_image_url = "/files/images/#{standard_name}"
      self.thumbnail_image_url = "/files/images/#{thumbnail_name}"
    end
  end

  def delete_image
    path = "#{Rails.root}/public/"

    std = path + ( standard_image_url || '' )
    thumbnail = path + ( thumbnail_image_url || '' )

    File.delete(std) if File.exist?(std) && File.file?(std)
    File.delete(thumbnail) if File.exist?(thumbnail) && File.file?(thumbnail)
  end

  def availability_stops_after_start
    if self.space_availability_start > self.space_availability_stop
        self.errors.add(:space_availability_start, 'should be lower than stop')
    end
  end


  def expired?
    Time.now >= space_availability_stop
  end

  def init
    self.interval ||= :short_term
  end

end