class Proposal < DeviceRecord
  scope :with_messages, -> (prop_id) { includes(:messages).find(prop_id) }

  enum approval_status: [:pending, :rejected, :approved]

  belongs_to :parking_space
  has_many :messages, :dependent => :destroy

  validates :bidder_name, :presence => true
  validates :approval_status, :presence => true
  validates :bid_amount, :presence => true
  validates :bid_currency, :presence => true
  validate :space_is_not_expired
  validate :propose_same_price_twice, :on => :create
  validate :propose_on_own_post, :on => :create

  after_initialize :init

  def init
    self.approval_status ||= :pending
  end

  def propose_on_own_post
    if parking_space.deviceid == deviceid
      #bidding for own parking space
      errors.add :general, 'Not allowed to bid on own post!'
    end
  end

  def propose_same_price_twice
    if bid_amount.nil?
      return
    end
    unless bid_amount > 0
      errors.add :general, 'Cannot place a bid with 0 or negative price!'
      return
    end
    bid_price_epsilon = SysParams.instance.get_f('bid_price_epsilon')
    prop_with_same_price = Proposal.where(:bid_amount => (bid_amount - bid_price_epsilon).to_f .. (bid_amount + bid_price_epsilon).to_f,
                                          :parking_space_id => parking_space_id, :bid_currency => bid_currency )
    if prop_with_same_price.exists?
      errors.add :general, 'A bid already exists with that price (±0.05)!'
    end
  end

  def space_is_not_expired
    if parking_space.expired?
      errors.add :general, 'The parking space has expired!'
    end
  end

  # only the owner of the parking space can approve or reject an offer
  def approve(owner_deviceid)
    if parking_space.deviceid == owner_deviceid
      approved!
      save
    else
      errors.add :general, 'You are not allowed to accept the offer!'
      false
    end
  end

  def reject(owner_deviceid)
    if parking_space.deviceid == owner_deviceid
      rejected!
      save
    else
      errors.add :general, 'You are not allowed to reject the offer!'
      false
    end
  end
end
