class TerminalsController < ApplicationController
  before_action :set_registration, only: [:show, :edit, :update, :destroy]

  respond_to :html

  def index
    @registrations = User.all
    respond_with(@registrations)
  end

  def show
    respond_with(@registration)
  end

  def new
    @registration = User.new
    respond_with(@registration)
  end

  def edit
  end

  def create
    @registration = User.new(registration_params)
    @registration.save
    respond_with(@registration)
  end

  def update
    @registration.update(registration_params)
    respond_with(@registration)
  end

  def logout
    @user = User.find(params[:terminal_id])
    sign_out(@user) # this line here signs out the current_user
    redirect_to action: "index"
  end

  def destroy
    @registration.destroy
    respond_with(@registration)
  end

  private
  def set_registration
    @registration = User.find(params[:id])
  end

  def registration_params
    params.require(:registration).permit(:email, :notif_registration_id)
  end
end
