require 'test_helper'

class UserMailerTest < ActionMailer::TestCase
  test "new_space" do
    mail = UserMailer.new_space
    assert_equal "New space", mail.subject
    assert_equal ["to@example.org"], mail.to
    assert_equal ["from@example.com"], mail.from
    assert_match "Hi", mail.body.encoded
  end

  test "new_offer" do
    mail = UserMailer.new_offer
    assert_equal "New offer", mail.subject
    assert_equal ["to@example.org"], mail.to
    assert_equal ["from@example.com"], mail.from
    assert_match "Hi", mail.body.encoded
  end

  test "reservation_approaching" do
    mail = UserMailer.reservation_approaching
    assert_equal "Reservation approaching", mail.subject
    assert_equal ["to@example.org"], mail.to
    assert_equal ["from@example.com"], mail.from
    assert_match "Hi", mail.body.encoded
  end

end
