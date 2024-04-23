module Api
  class ProductsController < ApplicationController
    include CurrentUserConcern
    
    def index
      if @current_user
        user = User.find_by(email: @current_user.email)
        products = Product.where(:user_id => user.id)

        render json: ProductSerializer.new(products,options).serializable_hash.to_json
      else
        render json: {error: "Not logged in"}, status: 401
      end
    end

    def index_profile
        begin
          user = User.find_by(id: params[:id])
          products = Product.where(:user_id => params[:id])
          render json: ProductSerializer.new(products,options).serializable_hash.to_json
        rescue
          render json: {error: "Profile does not exist"}, status: 401
        end
    end

    def show
      product = Product.find_by(id: params[:id])

      render json: ProductSerializer.new(product,options).serializable_hash.to_json
    end

    def create
      if @current_user 
        product = Product.new(products_params.merge(:user_id => @current_user.id))

        if product.save
          render json: ProductSerializer.new(product,options).serializable_hash.to_json
        else
          render json: {error: product.errors.messages }, status: 401
        end
      else
        render json: {error: "Not Authorized"}, status: 401
      end
    end

    def update
      product = Product.find_by(id: params[:id])
      if @current_user and @current_user.id == product.user_id
        if product.update(products_params.merge(:user_id => @current_user.id))
          render json: ProductSerializer.new(product,options).serializable_hash.to_json
        else
          render json: {error: product.errors.messages }, status: 401
        end
      else
        render json: {error: "Not Authorized"}, status: 401
      end
    end

    def destroy
      product = Product.find_by(id: params[:id])
      if @current_user and @current_user.id == product.user_id
        if product.destroy
          head :no_content
        else
          render json: {error: product.errors.messages}, status: 401
        end
      else
        render json: {error: "Not Authorized"}, status: 401
      end
    end

    private

    def products_params
      params.require(:product).permit(:title, :description, :summary, :price, :type, :live, :collab_active, :thumbimageSource, :coverimageSource)
    end

    def options
      @options ||= {include: %i[reviews collabs]}
    end

  end
end
