class ParkingSpace < DeviceRecord
  include ActiveModel::Dirty

  enum interval: [:long_term, :short_term]

  scope :non_expired, -> { where(' parking_spaces.created_at >= ? ', SysParams.instance.get_i('long_term_expiration').weeks.ago) }

  scope :long_term, -> { where('parking_spaces.interval = ? and parking_spaces.created_at >= ? ', ParkingSpace.intervals[:long_term], SysParams.instance.get_i('long_term_expiration').weeks.ago) }
  scope :short_term, -> { where('parking_spaces.interval = ? and parking_spaces.created_at >= ? ', ParkingSpace.intervals[:short_term], SysParams.instance.get_i('short_term_expiration').minutes.ago) }
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

  attr_accessor :image_data
  attr_accessor :thumbnail_data

  before_save :save_image_and_thumbnail
  after_destroy :delete_image
  after_initialize :init


  def save_image_and_thumbnail
    if image_data.present?
      path = "#{Rails.root}/public/files/images/"
      FileUtils.mkdir_p(path) unless File.directory?(path)
      standard_name = "#{deviceid}_standard_#{image_file_name}"
      thumbnail_name = "#{deviceid}_thumbnail_#{image_file_name}"
      File.open(path + standard_name, 'wb') do |file|
        file.write(Base64.decode64(self.image_data))
      end

      File.open(path + thumbnail_name, 'wb') do |file|
        file.write(Base64.decode64(self.thumbnail_data)) if thumbnail_data.present?
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

  def expired?
    sysparams = SysParams.instance
    expire_date = short_term? ? sysparams.get_i('short_term_expiration').minutes.ago : sysparams.get_i('long_term_expiration').weeks.ago
    expire_date >= created_at
  end

  def init
    self.interval ||= :short_term
  end

end