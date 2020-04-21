class Proposal < ActiveRecord::Base

  scope :for_space, ->(sp_id) { where('proposals.parking_space_id = ? ', sp_id) }
  scope :price_above, ->(price) { where('proposals.bid_amount >= ? ', price) }
  scope :active_or_future, -> { where('proposals.end_date >= ?', Time.now) }
  scope :outside_period, lambda { |start, end_p|
    where('proposals.start_date <= ?
                                  OR proposals.end_date >= ? ', start, end_p) }

  enum approval_status: %i[pending rejected approved canceled]
  enum payment_status: %i[unpaid paid]

  belongs_to :parking_space
  belongs_to :user

  validates :bidder_name, presence: true
  validates :approval_status, presence: true
  validates :bid_amount, presence: true
  validates :bid_currency, presence: true
  validate :offers_do_not_overlap, on: %i[create update], unless: :skip_overlap_check
  validate :no_pending_similar_offer, on: %i[create update], unless: :skip_overlap_check
  validate :bid_amount_valid, on: :create
  validate :space_is_not_expired, unless: :skip_expiration_check
  validate :cannot_update_expired, on: :update, unless: :skip_expiration_check
  validate :cannot_update_paid, on: :update, unless: :skip_paid_check

  attr_accessor :skip_overlap_check
  attr_accessor :skip_expiration_check
  attr_accessor :skip_paid_check

  after_initialize :init

  def init
    self.approval_status ||= :pending
    self.payment_status ||= :unpaid
    self.skip_overlap_check = false
    self.skip_expiration_check = false
  end


  def bid_amount_valid
    unless bid_amount.nil? or bid_amount >= 0
      errors.add :general, 'Cannot place a bid with negative price!'
      false
    end
  end

  def no_pending_similar_offer
    props_for_space = Proposal.for_space(parking_space_id).pending.where user_id: user.id
    if overlap? props_for_space
      errors.add :general, 'Există deja o ofertă similară pentru acest interva de timp!'
    end
  end

  def offers_do_not_overlap
    props_for_space = Proposal.for_space(parking_space_id).approved
    if overlap? props_for_space
      errors.add :general, 'Locul este rezervat pentru perioada selectată!'
    end
  end

  def overlap?(offers)
    return false if offers.empty?

    offers = offers.order :start_date
    # there are offers, let's make sure this offer does no§t overlap with existing
    # approved one
    offers.each do |offer|
      next_offer = offers [(offers.index offer) + 1]
      start_after_prev_end = start_date >= offer.end_date
      ends_before_next_start = true
      unless next_offer.nil?
        ends_before_next_start = end_date <= next_offer.start_date
      end

      return false if start_after_prev_end && ends_before_next_start
    end

    # if end_date is before all start_dates approve
    return false if end_date <= offers[0].start_date

    # if start_date is after all end_dates, approve
    offers = offers.reorder :end_date
    return false if start_date > offers[-1].end_date

    true
  end

  def cannot_update_expired
    if expired?
      errors.add :general, 'Oferta a expirat, aceasta nu se mai poate modifica!'
    end
  end

  def cannot_update_paid
    # should not be able to alter any offer info ( status, dates, etc)
    if paid?
      errors.add :general, 'Oferta a fost achitata, aceasta nu se mai poate modifica!'
    end
  end


  def space_is_not_expired
    if parking_space.expired?
      errors.add :general, 'Locul de parcare a expirat!'
    end
  end

  def reject
    self.skip_overlap_check = true
    if parking_space.user.id == user.id
      rejected!
    else
      errors.add :general, 'You are not allowed to reject the offer!'
      false
    end
  end

  def cancel
    self.skip_overlap_check = true
    if parking_space.user.id == user.id
      canceled!
    else
      errors.add :general, 'You are not allowed to cancel the offer!'
      false
    end
  end

  def approve
    # only the owner of the parking space can approve or reject an offer
    if parking_space.user.id != user.id
      errors.add :general, 'You are not allowed to accept the offer!'
      false
    else
      approved!
    end
  end

  def pay
    self.skip_overlap_check = true
    self.skip_expiration_check = true
    self.skip_paid_check = true
    self.payment_date = DateTime.now
    paid!
    approved!
  end

  def amount
    quarter_hrs = (end_date.to_time - start_date.to_time) / 0.25.hours
    quarter_hrs = quarter_hrs.ceil
    price_per_q_hr = parking_space.target_price / 4
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
    Time.now >= end_date
  end

  def active?
    start_date <= Time.now && Time.now <= end_date
  end
end
