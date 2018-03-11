require 'test_helper'

class ProposalTest < ActiveSupport::TestCase

  test 'should not approve proposal on expired space ' do
    SysParams.instance.set_default_value!('short_term_expiration', 0.01) # short term bids expire right away

    prop = Proposal.find(3)

    begin
      prop.approve('IMEI8129331241')
      failure
    rescue ActiveRecord::RecordInvalid
      prop.errors.size.must_be :>=, 1
    end


    prop = Proposal.find(3)
    # assert proposal unchanged
    assert !prop.approved?
    assert !prop.rejected?
    assert prop.pending?
    assert_equal 'IMEI8129631234', prop.deviceid
    assert_equal 'Hello, I\'d like to buy spot #2', prop.title_message
    assert_equal 'someone', prop.bidder_name
    assert_equal 'pending', prop.approval_status
    assert_equal 'EUR', prop['bid_currency']

  end


  test 'should not reject proposal on expired space ' do
    SysParams.instance.set_default_value!('short_term_expiration', 0.01) # short term bids expire right away

    prop = Proposal.find(3)

    begin
      prop.reject('IMEI8129331241')
      failure
    rescue ActiveRecord::RecordInvalid
      prop.errors.size.must_be :>=, 1
    end


    prop = Proposal.find(3)
    # assert proposal unchanged
    assert !prop.approved?
    assert !prop.rejected?
    assert prop.pending?
    assert_equal 'IMEI8129631234', prop.deviceid
    assert_equal 'Hello, I\'d like to buy spot #2', prop.title_message
    assert_equal 'someone', prop.bidder_name
    assert_equal 'pending', prop.approval_status
    assert_equal 'EUR', prop['bid_currency']

  end


  test 'should not be able to bid twice within the price range' do
    SysParams.instance.set_default_value!('short_term_expiration', 2)

    prop = Proposal.new({
                            deviceid: 'IMEI8129631X33',
                            title_message: 'Proposal message for create test',
                            bid_amount: 20,
                            bid_currency: 'RON',
                            bidder_name: 'some_bidder',
                            parking_space_id: 3
                        })

    # bidder should not be able to bid 20 for the same space
    begin
      prop.save!
      failure
    rescue ActiveRecord::RecordInvalid
      prop.errors.size.must_be :>=, 1
    end

    prop = Proposal.new({
                            deviceid: 'IMEI8129631X33',
                            title_message: 'Proposal message for create test',
                            bid_amount: 20.0 + SysParams.instance.get_f('bid_price_epsilon') + 0.01,
                            bid_currency: 'RON',
                            bidder_name: 'some_bidder',
                            parking_space_id: 3
                        })
    # bidder should be able to bid 20.06 for the same space
    assert prop.save!

    #bidder should be able to bid 20 for a different space
    prop = Proposal.new({
                            deviceid: 'IMEI8129631X33',
                            title_message: 'Proposal message for create test',
                            bid_amount: 20,
                            bid_currency: 'RON',
                            bidder_name: 'some_bidder',
                            parking_space_id: 2
                        })
    assert prop.save!
  end


  test 'big decimal rounding' do
    SysParams.instance.set_default_value!('short_term_expiration', 2)

    prop = Proposal.new({
                            deviceid: 'IMEI8129631X33',
                            title_message: 'Proposal message for create test',
                            bid_amount: 23.23,
                            bid_currency: 'RON',
                            bidder_name: 'some_bidder',
                            parking_space_id: 3
                        })
    prop.save!
    saved_prop = Proposal.find_by :deviceid => 'IMEI8129631X33'

    saved_prop.bid_amount.must_be :==,23.23

    prop = Proposal.new({
                            deviceid: 'IMEI8129631X34',
                            title_message: 'Proposal message for create test',
                            bid_amount: 24.234,
                            bid_currency: 'RON',
                            bidder_name: 'some_bidder',
                            parking_space_id: 3
                        })
    prop.save!
    saved_prop = Proposal.find_by :deviceid => 'IMEI8129631X34'

    saved_prop.bid_amount.must_be :==,24.234

    prop = Proposal.new({
                            deviceid: 'IMEI8129631X35',
                            title_message: 'Proposal message for create test',
                            bid_amount: 0.001,
                            bid_currency: 'RON',
                            bidder_name: 'some_bidder',
                            parking_space_id: 3
                        })

    prop.save!
    saved_prop = Proposal.find_by :deviceid => 'IMEI8129631X35'

    saved_prop.bid_amount.must_be :==,0.001

  end
end
