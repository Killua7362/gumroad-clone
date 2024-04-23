module Api
  class ReviewsController < ApplicationController
    include CurrentUserConcern

    def create
      if @current_user 
        review = Review.new(review_params.merge(:user_id => @current_user.id))

        if review.save
          render json: ReviewSerializer.new(review).serializable_hash.to_json
        else
          render json: {error: review.errors.messages}, status: 401
        end
      else
        render json: {error: "Not Authorized"}, status: 401
      end
    end
    
    def update
      review = Review.find_by(id: params[:id])
      
      if @current_user and @current_user.id == review.user_id
        if review.update(review_params.merge(:user_id => @current_user.id))
          render json: ReviewSerializer.new(review).serializable_hash.to_json
        else
          render json: {error: review.errors.messages}, status: 401
        end
      else
        render json: {error: "Not Authorized"}, status: 401
      end

    end

    def destroy
      review = Review.find_by(id: params[:id])

      if @current_user and @current_user.id == review.user_id
        if review.destroy
          head :no_content
        else
          render json: {error: review.errors.messages}, status: 401
        end
      else
        render json: {error: "Not Authorized"}, status: 401
      end
    end

    private

    def review_params
      params.require(:review).permit(:title, :description, :score, :products_id)
    end
  end
end
