require 'test_helper'

class ProposalsControllerTest < ActionController::TestCase


  test 'should get proposals for parking space' do
    xhr :get, :index, parking_space_id: 1

    proposals = assigns(:proposals)
    assert_equal 2, proposals.size
    assert_equal 'IMEI8129631232', proposals[0].deviceid
    assert_equal 'IMEI8129631233', proposals[1].deviceid

    prop = JSON.parse(@response.body)
    # deviceid is secret
    assert_nil prop[0]['deviceid']
    assert_nil prop[1]['deviceid']

  end

  test 'should create proposal for parking space' do
    assert_difference ('Proposal.count') do
      xhr :post, :create, parking_space_id: 2, :proposal => {
          deviceid: 'IMEI8129532232',
          title_message: 'Proposal message for create test',
          # parking_space_id: 2,
          bid_amount: 10,
          bid_currency: 'RON',
          bidder_name: 'someone',
          status: 'pending',
          parking_space_id: 2
      }
    end

    prop = JSON.parse(@response.body)
    # deviceid is secret
    assert_nil prop['deviceid']
    assert_equal 'Proposal message for create test', prop['title_message']
    assert_equal 10, prop['bid_amount']
    assert_equal 'RON', prop['bid_currency']
    assert_equal 'pending', prop['status']
    assert        assigns(:proposal).pending?

  end

  test 'should not create proposal for expired parking space' do
    # ? necesary ?
  end

  test 'should not create proposal with missing fields' do
    assert_difference('Proposal.count',0) do
      xhr :post, :create, parking_space_id: 2, :proposal => {
          deviceid: 'IMEI8129532232',
          bidder_name: 'someone',
          title_message: 'Proposal message for create test',
          # bid_amount: 3,
          bid_currency: 'RON',
          status: 'pending',
          parking_space_id: 2
      }
    end

    assert_difference('Proposal.count',0) do
      xhr :post, :create, parking_space_id: 2, :proposal => {
          deviceid: 'IMEI8129532232',
          bidder_name: 'someone',
          title_message: 'Proposal message for create test',
          bid_amount: 3,
          #bid_currency: 'RON',
          status: 'pending',
          parking_space_id: 2
      }
    end

    assert_difference('Proposal.count',0) do
      xhr :post, :create, parking_space_id: 2, :proposal => {
         # deviceid: 'IMEI8129532232',
          bidder_name: 'someone',
          title_message: 'Proposal message for create test',
          bid_amount: 3,
          bid_currency: 'RON',
          status: 'pending',
          parking_space_id: 2
      }
    end

    assert_difference('Proposal.count',0) do
      xhr :post, :create, parking_space_id: 2, :proposal => {
          deviceid: 'IMEI8129532232',
          bidder_name: 'someone',
          title_message: 'Proposal message for create test',
          bid_amount: 3,
          bid_currency: 'RON',
         # status: 'pending',
          parking_space_id: 2
      }
    end
  end

  test 'should update proposal for parking space' do
    xhr :put, :update, parking_space_id: 2, id: 2, :proposal => {
        deviceid: 'IMEI8129631233',
        title_message: 'Proposal message for create test',
        id: 2,
        bid_amount: 10,
        bid_currency: 'RON',
        bidder_name: 'someone',
        status: 'pending',
        parking_space_id: 2
    }


    assert_equal 'Proposal message for create test', assigns(:proposal).title_message

    prop = JSON.parse(@response.body)
    assert_nil prop['deviceid']
    assert_equal 'Proposal message for create test', prop['title_message']
    assert_equal 10, prop['bid_amount']
    assert_equal 'RON', prop['bid_currency']

  end

  test 'should not update proposal for parking space if invalid deviceid' do
    xhr :put, :update, parking_space_id: 2, id: 2, :proposal => {
        deviceid: 'IMEI8129631X33',
        title_message: 'Proposal message for create test',
        id: 2,
        bid_amount: 10,
        bid_currency: 'RON',
        parking_space_id: 2
    }

    assert_response :unprocessable_entity
  end

  test 'should not update proposal for parking space if missing deviceid' do
    xhr :put, :update, parking_space_id: 2, id: 2, :proposal => {
        title_message: 'Proposal message for create test',
        id: 2,
        bid_amount: 10,
        bid_currency: 'RON',
        parking_space_id: 2
    }

    assert_response :unprocessable_entity
  end


  test 'reject proposal ' do
    xhr :post, :reject , parking_space_id: 2, proposal_id: 4, :reject => {
        owner_deviceid: 'IMEI8129331241'
    }
    assert_response :success

    prop = assigns(:proposal)
    assert prop.rejected?
    assert_equal 'IMEI8129631235', prop.deviceid

    prop = JSON.parse(@response.body)
    # deviceid is secret
    assert_nil prop['deviceid']
    assert_equal 'Hello, I\'d like to buy spot #2', prop['title_message']
    assert_equal 'someone', prop['bidder_name']
    assert_equal 20, prop['bid_amount']
    assert_equal 'RON', prop['bid_currency']
  end


  test 'reject proposal invalid deviceid ' do
    xhr :post, :reject , parking_space_id: 2, proposal_id: 4, :reject => {
        owner_deviceid: 'IMEI81293312X1'
    }
    assert_response :unprocessable_entity

    prop = assigns(:proposal)

    # assert proposal unchaged
    assert !prop.rejected?
    assert_equal 'IMEI8129631235', prop.deviceid
    assert_equal 'Hello, I\'d like to buy spot #2', prop.title_message
    assert_equal 'someone', prop.bidder_name


  end


  test 'approve proposal ' do
    xhr :post, :approve , parking_space_id: 2, proposal_id: 4, :approve => {
        owner_deviceid: 'IMEI8129331241'
    }
    assert_response :success

    prop = assigns(:proposal)
    assert prop.approved?
    assert_equal 'IMEI8129631235', prop.deviceid

    prop = JSON.parse(@response.body)
    # deviceid is secret
    assert_nil prop['deviceid']
    assert_equal 'Hello, I\'d like to buy spot #2', prop['title_message']
    assert_equal 'someone', prop['bidder_name']
    assert_equal 20, prop['bid_amount']
    assert_equal 'RON', prop['bid_currency']
  end

end
