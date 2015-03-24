require 'test_helper'

class MessagesControllerTest < ActionController::TestCase


  test 'should create message with parking space device id ' do
    session[:deviceid] = 'IMEI8129231231'
    assert_difference ('Message.count') do
      xhr :post, :create, parking_space_id: 1, proposal_id: 1, :message => {
          deviceid: 'IMEI8129231231',
          content: 'message for proposal 1, parking space 1 ',
          proposal_id: 1
      }

      message = assigns(:message)
      assert_equal 3, message.proposal.messages.size
      assert_equal 1, message.proposal.id

      deserialized_msg = JSON.parse(@response.body)

      assert_equal 'message for proposal 1, parking space 1 ', deserialized_msg['content']
      assert deserialized_msg['created_at']
      assert_equal true, deserialized_msg['owner_is_current_user']
    end
  end

  test 'should create message with proposal device id' do
    assert_difference ('Message.count') do
      xhr :post, :create,   parking_space_id: 1, proposal_id: 2, :message => {
          deviceid: 'IMEI8129631233',
          content: 'message for proposal 2, parking space 1 ',
          proposal_id: 2
      }

      msg_entity = assigns(:message)

      msg = JSON.parse(@response.body)

      assert_equal 2, msg['proposal_id']
      assert_equal 'message for proposal 2, parking space 1 ', msg['content']
      msg_entity.created_at > 10.seconds.ago
    end

  end


  test 'should not create message with no proposal or parking space device id' do
    assert_difference('Message.count', 0) do
      xhr :post, :create, parking_space_id: 1, proposal_id: 2, :message => {
          content: 'message for proposal 2, parking space 1 ',
          proposal_id: 2
      }

      assert assigns(:message).invalid?
      assert_equal 2, assigns(:message).errors.size
      assert_equal 'invalid', assigns(:message).errors[:deviceid][0]
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
