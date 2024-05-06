module Api
  class ProfilesController < ApplicationController
    include CurrentUserConcern

    def index
        begin
          user = User.find_by!(id: params[:id])
          products = Product.where(:user_id => params[:id],:live => true)
          render json: ProductSerializer.new(products,options).serializable_hash.to_json
        rescue
          render json: {error: "Profile does not exist"}, status: 401
        end
    end

    private 

    def options
      @options ||= {include: %i[reviews collabs]}
    end

  end
end
