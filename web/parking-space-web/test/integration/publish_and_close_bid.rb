class PublishAndCloseBidTest < ActionController::TestCase


  test 'create parking space and approve proposal' do

    #publish a new parking space

    #
  end



  module PublishAndCloseBidActions

    def publish_parking_space
      create_new_url = css_select('.btn.btn-primary')[0]['href']
      get create_new_url
      @save_url = css_select('form')[0]['action']
      assert_response :success
    end

    def search_for_parking_spaces
      edit_impr_area = css_select('tbody > tr > td > a')[0]['href']
      get edit_impr_area
      assert_response :success
      @save_url = css_select('form')[0]['action']
      assert_equal improvement_action_path, @save_url
    end

    def view_parking_space_details

    end

    def send_proposal (parking_space_id)

    end

    def reject_proposal (proposal_id)

    end

    def approve_proposal

    end


  end

end