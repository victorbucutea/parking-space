class EmployeesController < ApplicationController
  def list
    if params[:query].nil?
      @users = []
    else
      current_company = Company.accessible_by(current_ability)
      # return employees of current user company
      @users = User.includes(:roles).with_name(params[:query]).for_companies(current_company.ids)
    end
    render :employees, status: :ok

  end

  def details
    @user = User.find(params[:id])

    render :show, status: :ok
  end
end
