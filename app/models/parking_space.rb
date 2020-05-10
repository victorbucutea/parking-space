class ParkingSpace < ActiveRecord::Base
  include ActiveModel::Dirty

  has_many :proposals, dependent: :destroy
  has_many :approved_proposals, -> { where(approval_status: 2) }, class_name: 'Proposal'
  has_many :documents, dependent: :destroy
  has_many :images, dependent: :destroy
  has_one :parking_perimeter

  belongs_to :user
  belongs_to :company

  enum legal_type: %i[public_parking private_parking]
  enum source_type: %i[user_source sensor_source company_source]
  enum status: %i[missing_title_deed validation_pending validated]

  scope :not_expired, lambda {
    where('parking_spaces.space_availability_stop >= ?
                              or parking_spaces.space_availability_stop is null', Time.now) }

  scope :active, lambda { |current_user|
    where('parking_spaces.space_availability_start <= ?
                    AND parking_spaces.status = ?
                    OR parking_spaces.user_id = ? ', Time.now, 2, current_user) }

  scope :within_boundaries, lambda { |attrs|
    where('parking_spaces.location_lat >= :lat_min
                    AND parking_spaces.location_lat <= :lat_max
                    AND parking_spaces.location_long >= :lon_min
                    AND parking_spaces.location_long <= :lon_max', attrs) }

  scope :for_company, ->(c) { where(' parking_spaces. company_id = ?', c) }


  validates :location_lat, presence: true, numericality: {greater_than_or_equal_to: -90, less_than_or_equal_to: 90}
  validates :location_long, presence: true, numericality: {greater_than_or_equal_to: -180, less_than_or_equal_to: 180}

  validates :address_line_1, presence: true
  validates :title, presence: true
  validates :target_price, presence: true
  validates :target_price_currency, presence: true
  validates :space_availability_start, presence: true
  validate :availability_stops_after_start
  validate :availability_includes_reservations

  after_initialize :init


  def availability_stops_after_start
    return if space_availability_stop.nil?
    if space_availability_start > space_availability_stop
      errors.add(:space_availability_start, 'should be lower than stop')
    end
  end

  def availability_includes_reservations
    return if space_availability_stop.nil?
    props_outside_period = Proposal.for_space(self).active_or_future.outside_period space_availability_start, space_availability_stop
    if props_outside_period.any?
      errors.add(:space_availability_start, 'Există rezervari active pe perioada selectată!')
    end
  end


  def init
    self.legal_type ||= :private_parking
    self.status ||= :missing_title_deed
  end

  def has_paid_proposals?
    proposals.each do |offer|
      if offer.end_date > DateTime.now && offer.paid?
        return true
      end
    end
    false
  end

  def expired?
    !space_availability_stop.nil? and Time.now >= space_availability_stop
  end

end