class SectionsController < ApplicationController
  before_action :set_section, only: [:show, :edit, :update, :destroy]

  before_action :set_section_p, only: %i[save_perimeters  perimeters]


  def add_parking_place
  end

  def remove_parking_place
  end

  def assign_parking_place
  end


  # GET /sections
  # GET /sections.json
  def index
    @sections = Section.all
  end

  # GET /sections/1
  # GET /sections/1.json
  def show
  end

  # GET /sections/new
  def new
    @section = Section.new
  end

  # GET /sections/1/edit
  def edit
  end

  # POST /sections
  # POST /sections.json
  def create
    @section = Section.new(section_params)

    respond_to do |format|
      if @section.save
        format.json { render :show, status: :created, location: @section }
      else
        format.json { render json: @section.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /sections/1
  # PATCH/PUT /sections/1.json
  def update
    respond_to do |format|
      if @section.update(section_params)
        format.json { render :show, status: :ok, location: @section }
      else
        format.json { render json: @section.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /sections/1
  # DELETE /sections/1.json
  def destroy
    @section.destroy
    respond_to do |format|
      format.json { head :no_content }
    end
  end


  def perimeters
    respond_to do |format|
      format.json {render 'sections/show_perimeters', status: :ok}
    end
  end


  def save_perimeters
    pers = params[:perimeters]
    @section.parking_perimeters.each do |per|
      exists = false
      pers.each do |incoming|
        exists = true if incoming[:id] == per.id
      end
      per.destroy unless exists
    end


    pers.each do |per|
      unless per[:user].nil?
        user = User.find_by_email(per[:user][:email])
      end
      if per[:id].nil? || per[:id] < 0
        per[:id] = nil
        perimeter = ParkingPerimeter.new(permiter_params(per))
        perimeter.user = user
        perimeter.save
      else
        perimeter = ParkingPerimeter.find(per[:id])
        perimeter.user = user
        perimeter.update(permiter_params(per))
      end


    end

    respond_to do |format|
      format.json { render 'sections/show_perimeters', status: :created }
    end

  end


  private

  # Use callbacks to share common setup or constraints between actions.
  def set_section
    @section = Section.find(params[:id])
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_section_p
    @section = Section.find(params[:section_id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def section_params
    params.require(:section).permit(:name, :description, :location_id)
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def permiter_params(perim_params)
    perim_params.permit(
        :id, :top_left_y, :top_left_x, :bottom_right_y, :bottom_right_x, :price,
        :identifier, :description, :perimeter_type, :lat, :lng, :section_id,
        :rules_expression, :user_attributes=>  [:email]
    )
  end
end
