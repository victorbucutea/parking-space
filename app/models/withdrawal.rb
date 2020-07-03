class Withdrawal < ActiveRecord::Base
  include ActiveModel::Dirty

  enum status: %i[pending rejected executed canceled]
  belongs_to :account
  validate :min_amount
  before_update :check_status
  after_initialize :init


  def init
    self.status ||= :pending
  end

  def min_amount
    unless amount >= 1
      errors.add :general, 'Nu puteți retrage suma mai mică de 1'
    end
  end

  def check_status
    return unless status_changed?

    old_status = status_change[0]
    unless old_status == 'pending'
      errors.add :general, 'Statusul retragerii nu mai permite anularea.'
    end
  end

  def rollback_amount
    account.amount += amount
    account.save
  end


end
