class Review < ActiveRecord::Base

  scope :for_space, ->(sp_id) { where('reviews.parking_space_id = ? ', sp_id) }

  belongs_to :parking_space
  belongs_to :user

  validate :user_has_offer, on: %i[create update]

  def user_has_offer
    user_offers = Proposal.for_space(parking_space).for_user(user)
    return unless user_offers.empty?

    errors.add :general, 'Nu poți adăuga un review dacă nu ai rezervat nicioată acest loc!'
  end

end
