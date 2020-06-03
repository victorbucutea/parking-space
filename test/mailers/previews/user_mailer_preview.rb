# Preview all emails at http://localhost:3000/rails/mailers/user_mailer
class UserMailerPreview < ActionMailer::Preview

  # Preview this email at http://localhost:3000/rails/mailers/user_mailer/new_space
  def new_space
    UserMailer.new_space
  end

  # Preview this email at http://localhost:3000/rails/mailers/user_mailer/new_offer
  def new_offer
    UserMailer.new_offer
  end

  # Preview this email at http://localhost:3000/rails/mailers/user_mailer/reservation_approaching
  def reservation_approaching
    UserMailer.reservation_approaching
  end

end
