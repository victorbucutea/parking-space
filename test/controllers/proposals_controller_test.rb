require 'test_helper'

class ProposalsControllerTest < ActionController::TestCase

  def setup
    @request.headers['Content-Type'] = 'application/json'
    @request.headers['Accept'] = 'application/json'
  end

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
      xhr :post, :create, parking_space_id: 3, :proposal => {
                   deviceid: 'IMEI8129532232',
                   title_message: 'Proposal message for create test',
                   bid_amount: 11,
                   bid_currency: 'RON',
                   bidder_name: 'someone',
                   parking_space_id: 3,
                   phone_number: '+40727256250'
               },
          format: :json
    end

    proposal = assigns(:proposal)
    assert 3, proposal.parking_space.id

    prop = JSON.parse(@response.body)
    # deviceid is secret
    assert_nil prop['deviceid']
    assert_equal 'Proposal message for create test', prop['title_message']
    assert_equal 11, prop['price']
    assert_equal 'RON', prop['currency']
    # default is pending
    assert true, prop['pending']
    assert !prop['approved']
    assert !prop['rejected']

  end


  test 'should not create proposal for own parking space' do
    assert_difference('Proposal.count', 0) do
      xhr :post, :create, parking_space_id: 3, :proposal => {
                   deviceid: 'IMEI8129331241', # device id of parking space 2
                   title_message: 'Proposal message for create test',
                   bid_amount: 10,
                   bid_currency: 'RON',
                   bidder_name: 'someone',
                   parking_space_id: 2,
                   phone_number: '+40727256250'
               },
           format: :json
    end

    @response.status.must_be :==, 422
    prop = JSON.parse(@response.body)
    prop['Error']['general'].size.must_be :==, 2 # cannot bid on own parking space & a bid already exists with that price

  end

  test 'should not create proposal with bid price 0 ' do
    assert_difference('Proposal.count', 0) do
      xhr :post, :create, parking_space_id: 2, :proposal => {
                   deviceid: 'IMEI8129532232',
                   bidder_name: 'someone',
                   title_message: 'Proposal message for create test',
                   bid_amount: 0,
                   bid_currency: 'RON',
                   approval_status: 'pending',
                   parking_space_id: 2
               },
          format: :json
    end


    @response.status.must_be :==, 422
    prop = JSON.parse(@response.body)
    prop['Error']['general'].size.must_be :==, 1

  end


  test 'should not create proposal with missing fields' do
    assert_difference('Proposal.count', 0) do
      xhr :post, :create, parking_space_id: 2, :proposal => {
                   deviceid: 'IMEI8129532232',
                   bidder_name: 'someone',
                   title_message: 'Proposal message for create test',
                   # bid_amount: 3,
                   bid_currency: 'RON',
                   approval_status: 'pending',
                   parking_space_id: 2
               },
          format: :json
    end

    assert_difference('Proposal.count', 0) do
      xhr :post, :create, parking_space_id: 2, :proposal => {
                   deviceid: 'IMEI8129532232',
                   bidder_name: 'someone',
                   title_message: 'Proposal message for create test',
                   bid_amount: 3,
                   #bid_currency: 'RON',
                   approval_status: 'pending',
                   parking_space_id: 2
               },
          format: :json
    end

    assert_difference('Proposal.count', 0) do
      xhr :post, :create, parking_space_id: 2, :proposal => {
                   # deviceid: 'IMEI8129532232',
                   bidder_name: 'someone',
                   title_message: 'Proposal message for create test',
                   bid_amount: 3,
                   bid_currency: 'RON',
                   approval_status: 'pending',
                   parking_space_id: 2
               },
          format: :json
    end

  end

  test 'should update proposal for parking space' do
    old_session_devid = session[:deviceid]
    session[:deviceid] = 'IMEI8129631233'

    xhr :put, :update, parking_space_id: 2, id: 2, :proposal => {
                title_message: 'Proposal message for create test',
                id: 2,
                bid_amount: 10,
                bid_currency: 'RON',
                bidder_name: 'someone',
                approval_status: 'pending',
                parking_space_id: 2
            }


    assert_equal 'Proposal message for create test', assigns(:proposal).title_message

    prop = JSON.parse(@response.body)
    assert_nil prop['deviceid']
    assert_equal 'Proposal message for create test', prop['title_message']
    assert_equal 10, prop['price']
    assert_equal 'RON', prop['currency']
    session[:deviceid] = old_session_devid


  end

  test 'should not update proposal for parking space if invalid deviceid' do
    old_session_devid = session[:deviceid]
    session[:deviceid] = 'IMEI8129631X33'
    xhr :put, :update, parking_space_id: 2, id: 2, :proposal => {
                title_message: 'Proposal message for create test',
                id: 2,
                bid_amount: 10,
                bid_currency: 'RON',
                parking_space_id: 2
            }

    assert_response :unprocessable_entity
    session[:deviceid] = old_session_devid
  end

  test 'should not update proposal ' do
    xhr :put, :update, parking_space_id: 2, id: 2, :proposal => {
                title_message: 'Proposal message for create test',
                id: 2,
                bid_amount: 10,
                bid_currency: 'RON',
                parking_space_id: 2
            }

    assert_response :unprocessable_entity
  end


  test 'reject proposal' do
    old_session_devid = session[:deviceid]
    session[:deviceid] = 'IMEI8129331241'
    xhr :post, :reject, parking_space_id: 2, proposal_id: 4, :reject => {},format: :json
    assert_response :success

    prop = assigns(:proposal)
    assert prop.rejected?
    assert_equal 'IMEI8129631235', prop.deviceid

    prop = JSON.parse(@response.body)
    # deviceid is secret
    assert_nil prop['deviceid']
    assert_equal 'Hello, I\'d like to buy spot #2', prop['title_message']
    assert_equal 'someone', prop['owner_name']
    assert_equal 21, prop['price']
    assert_equal 'RON', prop['currency']
    assert_equal true, prop['rejected']
    assert_equal false, prop['approved']

    session[:deviceid]= old_session_devid
  end


  test 'reject proposal invalid deviceid ' do
    old_session_devid = session[:deviceid]
    session[:deviceid] = 'IMEI812933124X' # parking space deviceid is IMEI8129331241
    xhr :post, :reject, parking_space_id: 2, proposal_id: 4, :reject => {}, format: :json
    assert_response :unprocessable_entity

    prop = assigns(:proposal)

    # assert proposal unchanged
    assert !prop.rejected?
    assert_equal 'IMEI8129631235', prop.deviceid
    assert_equal 'Hello, I\'d like to buy spot #2', prop.title_message
    assert_equal 'someone', prop.bidder_name
    assert_equal 'pending', prop.approval_status
    session[:deviceid]= old_session_devid
  end


  test 'approve proposal ' do
    old_session_devid = session[:deviceid]
    session[:deviceid] = 'IMEI8129331241'
    xhr :post, :approve, parking_space_id: 2, proposal_id: 4, :approve => {}, format: :json
    assert_response :success

    prop = assigns(:proposal)
    assert prop.approved?
    assert_equal 'IMEI8129631235', prop.deviceid
    # assert_equal 4, prop.parking_space.approved_proposal_id

    prop = JSON.parse(@response.body)
    # deviceid is secret
    assert_nil prop['deviceid']
    assert_equal 'Hello, I\'d like to buy spot #2', prop['title_message']
    assert_equal 'someone', prop['owner_name']
    assert_equal 21.0, prop['price']
    assert_equal true, prop['approved']
    assert_equal 'RON', prop['currency']

    session[:deviceid] = old_session_devid
  end


  test 'approve proposal should return error for expired space ' do
    old_session_devid = session[:deviceid]
    session[:deviceid] = 'IMEI8129331241'
    xhr :post, :approve, parking_space_id: 0, proposal_id: 8, :approve => {}, format: :json
    assert_response :unprocessable_entity

    prop = assigns(:proposal)
    assert !prop.approved?
    assert_equal 'IMEI8129299231', prop.deviceid # expect the right offer was approved

    prop = JSON.parse(@response.body)
    prop['Error']['general'].size.must_be :==,1

    session[:deviceid] = old_session_devid
  end

  test 'approve proposal should return error for invalid deviceid ' do
    old_session_devid = session[:deviceid]
    session[:deviceid] = 'IMEI812933124X'
    xhr :post, :approve, parking_space_id: 2, proposal_id: 3, :approve => {}, format: :json
    assert_response :unprocessable_entity

    prop = assigns(:proposal)
    assert !prop.approved?
    assert_equal 'IMEI8129631234', prop.deviceid # expect the target offer was not approved (id: 3)

    prop = JSON.parse(@response.body)
    prop['Error']['general'].size.must_be :==,1

    session[:deviceid] = old_session_devid
  end


end
