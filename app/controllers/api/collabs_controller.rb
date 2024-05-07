
module Api
  class CollabsController < ApplicationController
    include CurrentUserConcern

    def validate_user
      if @current_user 
        valid = true
        result = params[:collabs].map do |mail|
          if @current_user.email ==mail 
            valid = false 
            "Current user's email is not usable"
          elsif not User.find_by_email(mail)
            valid = false 
            "This user does not exist"
          else
            nil
          end
        end
        render json: {valid:valid,data:result }
      else
        render json: {error: "Not authorized"}, status: 401
      end
    end

    def index
      if @current_user
        collabs = Collab.where(:email => @current_user.email).distinct.pluck(:product_id)
        products = Product.where(id: collabs)
        render json: ProductSerializer.new(products,options).serializable_hash.to_json
      else
        render json: {error: "Not logged in"}, status: 401
      end
    end

    def approve
      if @current_user
        collab = Collab.find_by(email: @current_user.email, product_id: params[:id])
        if collab.update(approved: !collab.approved)
          render json: CollabSerializer.new(collab).serializable_hash.to_json
        else
          render json: {error: collab.errors.messages }, status: 401
        end
      else
        render json: {error: "Not logged in"}, status: 401
      end
    end

    def options
      @options ||= {include: %i[reviews collabs]}
    end

  end
end
    
