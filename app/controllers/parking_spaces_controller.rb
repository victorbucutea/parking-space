class ParkingSpacesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_parking_space, only: [:phone_number, :show, :update, :destroy]
  respond_to :json

  # GET /parking_spaces
  # GET /parking_spaces.json
  def index

    if current_user.company
      @parking_spaces = ParkingSpace.not_expired.active
                            .includes(:parking_perimeter)
                            .includes(:proposals)
                            .for_company current_user.company
      render :index, status: :ok
    end

    lat_min = params[:lat_min]
    lat_max = params[:lat_max]
    lon_min = params[:lon_min]
    lon_max = params[:lon_max]


    unless lat_min && lon_min && lat_max && lon_max
      render json: {Error: {general: "Missing parameters 'lat' or 'lon' min/max"}}, status: :unprocessable_entity
      return
    end

    query_attrs = {lon_min: lon_min, lon_max:lon_max, lat_min: lat_min, lat_max: lat_max}
    @parking_spaces = ParkingSpace.not_expired.active
                          .includes(:proposals)
                          .within_boundaries(query_attrs)
  end


  # GET /parking_spaces/1/phone_number
  def phone_number
    render json: {number: @parking_space.user.phone_number}, status: :ok
  end

  # GET /parking_spaces/1
  # GET /parking_spaces/1.json
  def show
  end


  def myspaces

    @parking_spaces = ParkingSpace.not_expired.active
                          .includes(:proposals)
                          .where({user: current_user})

    @parking_spaces.each do |space|
      space.owner = space.user
    end

    respond_to do |format|
      format.json {render :index, status: :ok}
    end
  end

  def myoffers

    @parking_spaces = ParkingSpace.not_expired.active
                          .includes(:proposals)
                          .where(proposals: {user: current_user})

    @parking_spaces.each do |space|
      space.owner = space.user
    end

    respond_to do |format|
      format.json {render :index, status: :ok}
    end
  end

  # POST /parking_spaces
  # POST /parking_spaces.json
  def create
    @parking_space = ParkingSpace.new(parking_space_params)
    @parking_space.user = current_user

    respond_to do |format|
      if @parking_space.save
        format.json {render :show, status: :created, location: @parking_space}
      else
        format.json {render json: {Error: @parking_space.errors}, status: :unprocessable_entity}
      end
    end
  end

  # PATCH/PUT /parking_spaces/1
  # PATCH/PUT /parking_spaces/1.json
  def update

    if current_user.id != @parking_space.user.id
      render json: {Error: {general: "Device id invalid"}}, status: :unprocessable_entity
      return
    end

    respond_to do |format|
      if @parking_space.update(parking_space_params)
        format.json {render :show, status: :ok, location: @parking_space}
      else
        format.json {render json: {Error: @parking_space.errors}, status: :unprocessable_entity}
      end
    end
  end

  # DELETE /parking_spaces/1
  # DELETE /parking_spaces/1.json
  def destroy
    if current_user.id != @parking_space.user.id
      render json: {Error: {general: "Device id invalid"}}, status: :unprocessable_entity
      return
    end

    if @parking_space.has_paid_proposals?
      render json: {Error: {general: "Nu se poate șterge un loc cu oferte plătite"}}, status: :unprocessable_entity
      return
    end

    @parking_space.destroy
    respond_to do |format|
      format.json {head :no_content}
    end
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_parking_space
    if params[:id].nil?
      @parking_space = ParkingSpace.find(params[:parking_space_id])
    else
      @parking_space = ParkingSpace.find(params[:id])
    end
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def parking_space_params
    params.require(:parking_space).permit(:location_lat, :location_long,
                                          :recorded_from_lat, :recorded_from_long,
                                          :target_price, :target_price_currency,
                                          :phone_number, :owner_name, :title,
                                          :address_line_1, :address_line_2,
                                          :space_availability_start, :space_availability_stop,
                                          :file1, :file2, :file3,
                                          :daily_start, :daily_stop, :weekly_schedule,
                                          :description, :created_at)
  end
end
