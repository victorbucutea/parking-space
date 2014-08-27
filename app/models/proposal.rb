class Proposal < DeviceRecord
  scope :with_messages, ->(prop_id) {includes(:messages).find(prop_id)}

  enum status: [ :pending, :rejected, :approved]

  belongs_to :parking_space
  has_many :messages

  validates :title_message, :presence => true
  validates :bidder_name, :presence => true
  validates :status, :presence => true
  validates :bid_amount, :presence => true
  validates :bid_currency, :presence => true

  def approve(owner_deviceid)
    change_status owner_deviceid do
      approved!
      parking_space.approved_proposal_id = id
      parking_space.save
    end
  end

  def reject(owner_deviceid)
    change_status owner_deviceid do
      rejected!
    end
  end

  def change_status(owner_deviceid, &block)
    if parking_space.deviceid == owner_deviceid
      yield
    else
      errors.add :deviceid, 'invalid'
    end

    return save
  end

end
