class Proposal < DeviceRecord
  scope :with_messages, ->(prop_id) { includes(:messages).find(prop_id) }
  scope :for_space, ->(sp_id) { where('proposals.parking_space_id = ? ', sp_id)}
  scope :price_above, ->(price) { where('proposals.bid_amount >= ? ', price)}


  enum approval_status: [:pending, :rejected, :approved]

  belongs_to :parking_space
  has_many :messages, :dependent => :destroy

  validates :bidder_name, :presence => true
  validates :approval_status, :presence => true
  validates :bid_amount, :presence => true
  validates :bid_currency, :presence => true
  validate :space_is_not_expired
  validate :propose_offer_twice, :on => :create
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

  def propose_offer_twice
    if bid_amount.nil?
      return
    end
    unless bid_amount > 0
      errors.add :general, 'Cannot place a bid with 0 or negative price!'
      return
    end
    prop_with_same_owner = Proposal.where(:parking_space_id => parking_space_id,
                                          :deviceid => deviceid )
    if prop_with_same_owner.exists?
      errors.add :general, 'Există deja o ofertă făcută de tine!'
    end
  end

  def space_is_not_expired
    if parking_space.expired?
      errors.add :general, 'Locul de parcare a expirat!'
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

  def auto_approve
    price = bid_amount
    props_for_space = Proposal.for_space(parking_space_id)
    asking_price = self.parking_space.target_price

    if props_for_space.empty?
      if price >= asking_price
        approved!
      end
    else
      # there are offers, but all are pending
      pending_cnt = Proposal.for_space(parking_space_id).where(approval_status: :pending).count
      total_cnt = Proposal.for_space(parking_space_id).count

      if pending_cnt == total_cnt
        # all offers are pending
        if price >= asking_price
          approved!
        end
      end
    end
  end
end
