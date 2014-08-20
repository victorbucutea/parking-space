require 'test_helper'

class ProposalsControllerTest < ActionController::TestCase


  test 'should get proposals for parking space' do
    xhr :get, :index, parking_space_id: 1

    proposals = assigns(:proposals)
    assert_equal 2, proposals.size
    assert_equal 'IMEI8129631232', proposals[0].deviceid
    assert_equal 'IMEI8129631233', proposals[1].deviceid

  end

  test 'should create proposal for parking space' do
    assert_difference ('Proposal.count') do
      xhr :post, :create, parking_space_id: 2, :proposal => {
          deviceid: 'IMEI8129532232',
          title_message: 'Proposal message for create test',
          # parking_space_id: 2,
          bid_amount: 10,
          bid_currency: 'RON'
      }
    end

    prop = JSON.parse(@response.body)
    # deviceid is secret
    assert_nil prop['deviceid']
    assert_equal 'Proposal message for create test', prop['title_message']
    assert_equal 10, prop['bid_amount']
    assert_equal 'EUR', prop['bid_currency']

  end

  test 'should not create proposal for expired parking space' do
    xhr :post, :index, parking_space_id: 0
  end

  test 'should update proposal for parking space' do

  end

  test 'should not update proposal for parking space if invalid deviceid' do

  end

  test 'should not update proposal for parking space if missing deviceid' do

  end

  test 'parking space should be won if accepted by parent parking_space deviceid' do

  end
end
