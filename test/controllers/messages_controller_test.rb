require 'test_helper'

class MessagesControllerTest < ActionController::TestCase


  test 'should create message with parking space device id ' do
    assert_difference ('Message.count') do
      xhr :post, :create, parking_space_id: 1, proposal_id: 1, :message => {
          deviceid: 'IMEI8129231231',
          content: 'message for proposal 1, parking space 1 ',
          proposal_id: 1
      }

      assert_equal 3, assigns(:proposal).messages.size

      proposal = JSON.parse(@response.body)

      assert_equal 3, proposal['messages'].size
      assert_equal 1, proposal['id']
      assert_equal 10, proposal['bid_amount']
    end
  end

  test 'should create message with proposal device id' do
    assert_difference ('Message.count') do
      xhr :post, :create,   parking_space_id: 1, proposal_id: 2, :message => {
          deviceid: 'IMEI8129631233',
          content: 'message for proposal 2, parking space 1 ',
          proposal_id: 2
      }

      assert_equal 3, assigns(:proposal).messages.size

      proposal = JSON.parse(@response.body)

      assert_equal 3, proposal['messages'].size
      assert_equal 2, proposal['id']
      assert_equal 20, proposal['bid_amount']
      assert_equal 'EUR', proposal['bid_currency']
    end

  end


  test 'should not create message with no proposal or parking space device id' do
    assert_difference ('Message.count') do
      xhr :post, :create, parking_space_id: 1, proposal_id: 2, :message => {
          content: 'message for proposal 2, parking space 1 ',
          proposal_id: 2
      }

      assert assigns(:message).invalid?
      assert_equal 2, assigns(:message).errors.size
      assert_equal 'invalid', assigns(:message).errors[:deviceid][0]
      assert_equal 'can\'t be blank', assigns(:message).errors[:deviceid][0]
    end
  end


  test 'should not create message with invalid proposal device id' do
    assert_difference 'Message.count',0 do
      xhr :post, :create, parking_space_id: 1, proposal_id: 1, :message => {
          deviceid: 'IMEI812923123X',
          content: 'message for proposal 2, parking space 1 ',
          proposal_id: 2
      }
    end
    assert assigns(:message).invalid?

    assert_equal 1, assigns(:message).errors.size
    end

  test 'should not create message with invalid parking space device id' do
    assert_difference 'Message.count',0 do
      xhr :post, :create, parking_space_id: 1, proposal_id: 1, :message => {
          deviceid: 'IMEI812923123X',
          content: 'message for proposal 1, parking space 1 ',
          proposal_id: 1
      }
    end
    assert assigns(:message).invalid?

    assert_equal 1, assigns(:message).errors.size
  end
end
