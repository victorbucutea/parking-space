class Proposal < DeviceRecord
  enum status: [ :pending, :rejected, :approved]
  belongs_to :parking_space
  has_many :messages

  validates :title_message, :presence => true
  validates :bidder_name, :presence => true
  validates :status, :presence => true
  validates :bid_amount, :presence => true
  validates :bid_currency, :presence => true

  def approve(owner_deviceid)

    if parking_space.deviceid == owner_deviceid
      approved!
    else
      errors.add :deviceid, 'invalid'
    end


    return save
  end

  def reject(owner_deviceid)

    if parking_space.deviceid == owner_deviceid
      rejected!
    else
       errors.add :deviceid, 'invalid'
    end

    return save
  end
end
