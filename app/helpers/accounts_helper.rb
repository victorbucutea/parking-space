module AccountsHelper

  def new_if_not_exists (acc)
    if acc.nil?
      acc = Account.new
      acc.user = current_user
      acc.currency = ParameterValue.find_by_key(current_user.country).value2
      acc.save
    end
    acc
  end
end
