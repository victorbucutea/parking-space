class ParkingSpacesController < ApplicationController

  before_action :authenticate_user!
  load_and_authorize_resource
  before_action :set_parking_space, only: %i[phone_number show update destroy attach_documents validate attach_images]
  respond_to :json

  # GET /parking_spaces
  # GET /parking_spaces.json
  def index
    if current_user.company
      @parking_spaces = ParkingSpace.not_expired.active
                            .includes(:parking_perimeter)
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

    query_attrs = { lon_min: lon_min, lon_max: lon_max, lat_min: lat_min, lat_max: lat_max }
    @parking_spaces = ParkingSpace.not_expired.active(current_user)
                          .includes(:user, :images)
                          .within_boundaries(query_attrs)
  end

  # GET /parking_spaces/1/phone_number
  def phone_number
    render json: {number: @parking_space.user.phone_number}, status: :ok
  end

  # GET /parking_spaces/1
  # GET /parking_spaces/1.json
  def show; end

  def myspaces
    @parking_spaces = ParkingSpace.includes(:proposals, :user)
                          .where(user: current_user)

    render :index, status: :ok
  end

  def myoffers
    @parking_spaces = ParkingSpace.not_expired.active
                          .includes(:proposals, :user)
                          .where(proposals: {user: current_user})

    render :index, status: :ok
  end

  def attach_documents
    docs = params[:docs]
    if docs.empty?
      return render json: {Error: 'No documents uploaded!'}, status: :unprocessable_entity
    end

    @parking_space.documents.destroy_all
    # save to parking_space_documents
    docs.each do |d|
      doc = @parking_space.documents.create(file: d, comment: 'User upload', status: 'uploaded')
      unless doc.errors.empty?
        return render json: {Error: doc.errors}, status: :unprocessable_entity
      end
    end
    # move to title_deed_pending
    @parking_space.validation_pending!

    render :show, status: :created, location: @parking_space
  end

  def attach_images
    imgs = params[:imgs]

    @parking_space.images.destroy_all
    # save to parking_space_documents
    imgs.each do |d|
      img = @parking_space.images.create(image: d[:name], comment: 'User upload')
      unless img.errors.empty?
        return render json: {Error: img.errors}, status: :unprocessable_entity
      end
    end

    render :show, status: :created, location: @parking_space
  end


  def validate
    # check user allowed to validate ( private_spaces_admin )
    # check title deed is attached
    # move to validated
  end

  # POST /parking_spaces
  # POST /parking_spaces.json
  def create
    @parking_space = ParkingSpace.new(parking_space_params)
    @parking_space.user = current_user

    if @parking_space.save
      render :show, status: :created, location: @parking_space
    else
      render json: {Error: @parking_space.errors}, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /parking_spaces/1
  # PATCH/PUT /parking_spaces/1.json
  def update
    if @parking_space.update(parking_space_params)
      render :show, status: :ok, location: @parking_space
    else
      render json: {Error: @parking_space.errors}, status: :unprocessable_entity
    end
  end

  # DELETE /parking_spaces/1
  # DELETE /parking_spaces/1.json
  def destroy

    # todo do not delete just expire validity

    @parking_space.destroy
    respond_to do |format|
      format.json { head :no_content }
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_parking_space
    @parking_space = if params[:id].nil?
                       ParkingSpace.find(params[:parking_space_id])
                     else
                       ParkingSpace.find(params[:id])
                     end
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def parking_space_params
    params.require(:parking_space).permit(:location_lat, :location_long,
                                          :target_price, :target_price_currency,
                                          :phone_number, :owner_name, :title,
                                          :address_line_1, :address_line_2,
                                          :space_availability_start, :space_availability_stop,
                                          :daily_start, :daily_stop, :weekly_schedule, :description,
                                          parking_space_images_attributes: [:image, :comment,:id])
  end

end
