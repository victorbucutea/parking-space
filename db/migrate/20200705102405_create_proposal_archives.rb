# frozen_string_literal: true

class CreateProposalArchives < ActiveRecord::Migration[5.2]
  def change
    create_table :proposal_archives do |t|
      t.integer 'proposal_id'
      t.integer 'parking_space_id'
      t.datetime 'created_at', null: false
      t.datetime 'updated_at', null: false
      t.decimal 'bid_amount'
      t.string 'bid_currency'
      t.string 'bidder_name'
      t.integer 'approval_status'
      t.string 'phone_number'
      t.datetime 'start_date', null: false
      t.datetime 'end_date', null: false
      t.integer 'payment_status'
      t.datetime 'payment_date'
      t.bigint 'user_id'
      t.string 'payment_id'
      t.decimal 'payment_amount'
      t.decimal 'payment_comision'
      t.decimal 'payment_vat'
      t.text :comment
      t.string 'created_by'
      t.timestamps
    end
  end
end
