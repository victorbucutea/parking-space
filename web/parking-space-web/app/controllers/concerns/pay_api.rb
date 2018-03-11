module PayApi
  extend ActiveSupport::Concern


  def get_payments
    gateway = Braintree::Gateway.new(
        environment: ENV['PAYMENT_ENV'].to_sym,
        merchant_id: ENV['MERCHANT_ID'],
        public_key: ENV['MERCHANT_PUB_KEY'],
        private_key: ENV['MERCHANT_PRIV_KEY']
    )

    gateway.transaction.search do |search|
      search.customer_id.is current_user.payment_id
    end
  end

  def get_payment_details_for (tx_id)
    gateway = Braintree::Gateway.new(
        environment: ENV['PAYMENT_ENV'].to_sym,
        merchant_id: ENV['MERCHANT_ID'],
        public_key: ENV['MERCHANT_PUB_KEY'],
        private_key: ENV['MERCHANT_PRIV_KEY']
    )

    gateway.transaction_line_item.find_all(tx_id)
  end

  def submit_payment

    # begin payment flow
    nonce = params[:nonce]

    gateway = Braintree::Gateway.new(
        environment: ENV['PAYMENT_ENV'].to_sym,
        merchant_id: ENV['MERCHANT_ID'],
        public_key: ENV['MERCHANT_PUB_KEY'],
        private_key: ENV['MERCHANT_PRIV_KEY']
    )

    addr = @proposal.parking_space.address_line_1
    total_amount = (@proposal.amount_with_vat + @proposal.comision_with_vat)
    line_items = [{
                      description: "Parcare #{addr} intre  #{@proposal.start_date} - #{@proposal.end_date}",
                      kind: 'debit',
                      name: 'Inchiriere spatiu parcare',
                      quantity: 1,
                      total_amount: @proposal.amount_with_vat,
                      unit_amount: @proposal.amount_with_vat,
                      tax_amount: @proposal.amount_with_vat - @proposal.amount
                  }, {
                      description: 'Comision operare (8%) + 2.5 Ron',
                      kind: 'debit',
                      name: 'Comision',
                      quantity: 1,
                      total_amount: @proposal.comision_with_vat,
                      unit_amount: @proposal.comision_with_vat,
                      tax_amount: @proposal.comision_with_vat - @proposal.comision
                  }
    ]

    # 4000111111111115
    if current_user.payment_id.nil?
      result = gateway.transaction.sale(
          amount: total_amount,
          payment_method_nonce: nonce,
          merchant_account_id: ENV['SECONDARY_MERCHANT_ID'],
          order_id: @proposal.id,
          customer: {
              first_name: current_user.full_name,
              email: current_user.email,
              phone: current_user.phone_number
          },
          line_items: line_items,
          options: {
              store_in_vault_on_success: true
          }
      )
      if result.success?
        current_user.payment_id = result.transaction.customer_details.id
        current_user.save
      end
      log_error(line_items, result)
      register_payment result, @proposal
      !result.respond_to? :errors
    else
      result = gateway.transaction.sale(
          amount: total_amount,
          customer_id: current_user.payment_id,
          payment_method_nonce: nonce,
          merchant_account_id: ENV['SECONDARY_MERCHANT_ID'],
          order_id: @proposal.id,
          line_items: line_items
      )
      log_error(line_items, result)
      register_payment result,  @proposal
      !result.respond_to? :errors
    end
  end

  def log_error(line_items, result)
    if result.respond_to? :errors
      res_str = ''
      result.errors.each do |err|
        res_str += err.code + ' - ' + err.attribute + ' - ' + err.message
      end
      logger.tagged("#{current_user.email}", "#{line_items}") {
        logger.error("error while executing tx for existing customer: #{res_str}")
      }
    end
  end

  def register_payment(result, prop)
    if result.success?
      begin
        account = current_user.account
        if current_user.account.nil?
          account = Account.new
          account.amount = prop.amount
          account.user = current_user
          account.currency = prop.bid_currency
        else
          account.amount += prop.amount
        end
        account.save
      rescue
        # failsafe so as not to return an error to the user if tx was successful
        true
      end
    end
  end
end
