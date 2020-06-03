class ReviewsController < ApplicationController
  before_action :set_review, only: %i[show edit update]

  # GET /reviews
  # GET /reviews.json
  def index
    @reviews = Review.for_space params[:space_id]
  end

  # GET /reviews/1
  # GET /reviews/1.json
  def show; end

  # GET /reviews/new
  def new
    @review = Review.new
  end

  # POST /reviews
  # POST /reviews.json
  def create
    @review = Review.new(review_params)
    @review.user = current_user

    if @review.save
      render :show, status: :created, location: @review
    else
      render json: { Error: @review.errors }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /reviews/1
  # PATCH/PUT /reviews/1.json
  def update
    if @review.update(review_params)
      render :show, status: :ok, location: @review
    else
      render json: @review.errors, status: :unprocessable_entity
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_review
    @review = Review.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list
  def review_params
    params.require(:review).permit(:comment, :title, :rating,
                                   :parking_space_id, :owner_name)
  end
end
