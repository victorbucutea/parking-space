class Proposal < DeviceRecord
  scope :with_messages, ->(prop_id) {includes(:messages).find(prop_id)}
  scope :for_space, ->(sp_id) {where('proposals.parking_space_id = ? ', sp_id)}
  scope :price_above, ->(price) {where('proposals.bid_amount >= ? ', price)}


  enum approval_status: [:pending, :rejected, :approved, :canceled]
  enum payment_status: [:unpaid, :paid]

  belongs_to :parking_space

  validates :bidder_name, :presence => true
  validates :approval_status, :presence => true
  validates :bid_amount, :presence => true
  validates :bid_currency, :presence => true
  validate :offers_do_not_overlap, :on => [:create, :update], :unless => :skip_overlap_check
  validate :bid_amount_valid, :on => :create
  validate :propose_on_own_post, :on => :create
  validate :space_is_not_expired, :unless => :skip_expiration_check
  validate :cannot_update_expired, :on => :update, :unless => :skip_expiration_check
  validate :cannot_update_paid, :on => :update, :unless => :skip_paid_check

  attr_accessor :skip_overlap_check
  attr_accessor :skip_expiration_check
  attr_accessor :skip_paid_check

  after_initialize :init

  def init
    self.approval_status ||= :pending
    self.skip_overlap_check = false
    self.skip_expiration_check = false
  end

  def propose_on_own_post
    if parking_space.deviceid == deviceid
      #bidding for own parking space
      errors.add :general, 'Not allowed to bid on own post!'
    end
  end

  def bid_amount_valid
    unless bid_amount.nil? or bid_amount > 0
      errors.add :general, 'Cannot place a bid with 0 or negative price!'
      false
    end
  end

  def offers_do_not_overlap

    props_for_space = Proposal.for_space(parking_space_id).approved.order(:start_date)

    if props_for_space.empty?
      self.approval_status = :approved;
    else
      # there are offers, let's make sure this offer does not overlap with existing one
      props_for_space.each do |offer|
        next_offer = props_for_space [(props_for_space.index offer) + 1]
        start_after_end = self.start_date >= offer.end_date
        ends_before_next_start = true
        unless next_offer.nil?
          ends_before_next_start = self.end_date <= next_offer.start_date
        end

        if start_after_end && ends_before_next_start
          self.approval_status = :approved
          return true
        end
      end

      # if end_date is before all start_dates approve
      if end_date <= props_for_space[0].start_date
        self.approval_status = :approved
        return true
      end

      # if start_date is after all end_dates, approve
      props_for_space = Proposal.for_space(parking_space_id).approved.order(:end_date)
      if start_date > props_for_space[-1].end_date
        self.approval_status = :approved
        return true
      end

      self.approval_status = :rejected
      errors.add :general, 'Locul este rezervat pentru perioada selectată!'
      false
    end
  end

  def cannot_update_expired
    if self.expired?
      errors.add :general, 'Oferta a expirat, aceasta nu se mai poate modifica!'
    end
  end

  def cannot_update_paid
    # should not be able to alter any offer info ( status, dates, etc)
    if self.paid?
      errors.add :general, 'Oferta a fost achitata, aceasta nu se mai poate modifica!'
    end
  end


  def space_is_not_expired
    if parking_space.expired?
      errors.add :general, 'Locul de parcare a expirat!'
    end
  end

  def reject(owner_deviceid)
    self.skip_overlap_check = true
    if parking_space.deviceid == owner_deviceid
      self.approval_status = 1
      save
    else
      errors.add :general, 'You are not allowed to reject the offer!'
      false
    end
  end

  def cancel(incoming_deviceid)
    self.skip_overlap_check = true
    if self.deviceid == incoming_deviceid
      self.approval_status = 3
      save
    else
      errors.add :general, 'You are not allowed to cancel the offer!'
      false
    end
  end

  def approve(owner_deviceid)
    # only the owner of the parking space can approve or reject an offer
    if self.parking_space.deviceid != owner_deviceid
      errors.add :general, 'You are not allowed to accept the offer!'
      false
    else
      self.approval_status = 2
      save
    end
  end

  def pay
    self.skip_overlap_check = true
    self.skip_expiration_check = true
    self.skip_paid_check = true
    self.payment_date = DateTime.now
    paid!
  end

  def amount
    quarter_hrs = (self.end_date.to_time - self.start_date.to_time) / (0.25).hours
    quarter_hrs = quarter_hrs.ceil
    price_per_q_hr = (self.parking_space.target_price) / 4
    (quarter_hrs * price_per_q_hr).round(0)
  end

  def amount_with_vat
    vat = APP_CONFIG['vat'].to_f
    (amount * (1 + vat)).round(2)
  end

  def comision
    c_fixed = APP_CONFIG['comision_fixed'].to_f
    c_percent = APP_CONFIG['comision_percent'].to_f
    ((amount * c_percent) + c_fixed).round(0)
  end

  def comision_with_vat
    vat = APP_CONFIG['vat'].to_f
    comision * (1 + vat).round(2)
  end

  def expired?
    Time.now >= self.end_date
  end
end
