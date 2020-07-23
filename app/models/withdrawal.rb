# frozen_string_literal: true

class Withdrawal < ActiveRecord::Base
  include ActiveModel::Dirty

  enum status: %i[pending rejected executed canceled]
  belongs_to :account
  before_update :check_status
  after_initialize :init
  validate :amount_available
  validate :positive_amount, unless: :allow_negative
  attr_accessor :allow_negative

  def init
    self.status ||= :pending
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

  private

  def positive_amount
    errors.add :general, 'Nu puteți retrage suma mai mică de 1' if amount < 1
  end

  def amount_available
    if amount > account.amount
      errors.add :general, 'Nu se poate retrage din cont suma solicitată'
    elsif account.amount - amount < account.amount_pending
      errors.add :general, 'Nu se poate retrage din cont suma aferentă ' \
                           'rezervărilor curente sau viitoare'
    end
  end
end
