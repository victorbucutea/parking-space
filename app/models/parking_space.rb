class ParkingSpace < ActiveRecord::Base
  include ActiveModel::Dirty

  default_scope { where('created_at >= ? ', 5.minutes.ago) }

  has_many :proposals

  validates :location_lat, :presence => true, numericality: { greater_than_or_equal_to: -90, less_than_or_equal_to: 90}
  validates :location_long, :presence => true, numericality: { greater_than_or_equal_to: -180, less_than_or_equal_to: 180}
  validates :recorded_from_lat, :presence => true
  validates :recorded_from_long, :presence => true
  validates :deviceid, :presence => true
  validate :deviceid_not_changed

  private
  def deviceid_not_changed

    if self.deviceid_was.nil?
      return
    end

    if self.deviceid_changed?
      self.errors.add(:deviceid, 'not correct')
    end
  end
end
