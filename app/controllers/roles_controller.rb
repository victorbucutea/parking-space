class RolesController < ApplicationController

  before_action :authenticate_user!
  load_and_authorize_resource

  before_action :set_role, only: [:show, :edit, :update, :destroy]

  # GET /roles
  # GET /roles.json
  def index
    @roles = Role.all
  end

  def user_company_roles
    @company = (User.find_by_id current_user) .company
    @roles = current_user.roles
    render :user_and_company, status: :ok
  end

  # GET /roles/1
  # GET /roles/1.json
  def show
  end

  # GET /roles/new
  def new
    @role = Role.new
  end

  # GET /roles/1/edit
  def edit
  end

  # POST /roles
  # POST /roles.json
  def create
    @role = Role.new(role_params)

    respond_to do |format|
      if @role.save
        format.json { render :show, status: :created, location: @role }
      else
        format.json { render json: @role.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /roles/1
  # PATCH/PUT /roles/1.json
  def update
    respond_to do |format|
      if @role.update(role_params)
        format.json { render :show, status: :ok, location: @role }
      else
        format.json { render json: @role.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /roles/1
  # DELETE /roles/1.json
  def destroy
    @role.destroy
    respond_to do |format|
      format.json { head :no_content }
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_role
    @role = Role.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def role_params
    params.require(:role).permit(:identifier, :user_id, :company_id, :location_id)
  end
end
