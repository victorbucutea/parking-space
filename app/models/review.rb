# frozen_string_literal: true

class Review < ActiveRecord::Base
  scope :for_space, ->(sp_id) { where('reviews.parking_space_id = ? ', sp_id) }

  belongs_to :parking_space
  belongs_to :user

  after_save :update_space

  validate :user_has_offer, on: %i[create update]
  validate :single_review, on: %i[create update]

  def user_has_offer
    user_offers = Proposal.past.for_space(parking_space).for_user(user)
    return unless user_offers.empty?

    errors.add :general, 'Nu poți adăuga un review dacă nu ai o rezervare incheiată pentru acest loc!'
  end

  def update_space
    avg = Review.for_space(parking_space).average(:rating)
    cnt = Review.for_space(parking_space).count
    parking_space.review_avg = avg.to_f.round(2)
    parking_space.review_count = cnt
    parking_space.save
  end

  def single_review
    other_reviews = Review.for_space(parking_space).where(user: user).count
    user_offers = Proposal.past.for_space(parking_space).for_user(user).count
    return if other_reviews <= user_offers

    errors.add :general, 'Poți adăuga maxim 1 review per rezervare încheiată!'
  end
end
