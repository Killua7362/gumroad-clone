module Api
  class ProductsController < ApplicationController
    include CurrentUserConcern

    def index
      if @current_user
        user = User.find_by(email: @current_user.email)
        products = Product.where(user_id: user.id)

        render json: ProductSerializer.new(products, options).serializable_hash.to_json
      else
        render json: { error: 'Not logged in' }, status: 401
      end
    end

    def create
      if @current_user
        product = Product.new(products_params.merge(user_id: @current_user.id))

        if product.save!
          render json: ProductSerializer.new(product, options).serializable_hash.to_json
        else
          render json: { error: product.errors.messages }, status: 401
        end
      else
        render json: { error: 'Not Authorized' }, status: 401
      end
    end

    def show
      product = Product.find_by(id: params[:id])
      if @current_user and @current_user.id == product.user_id
        render json: ProductSerializer.new(product, options).serializable_hash.to_json
      else
        render json: { error: 'Not Authorized' }, status: 401
      end
    end

    def update
      Product.transaction(joinable: false) do
        product = Product.find_by(id: params[:id])
        if @current_user and @current_user.id == product.user_id
          if (params[:live] == true or product.live == true) and !product.can_go_live
            product.update(live: false)
            render json: { error: 'Cannot go live because collaborators are yet to approve' }, status: 404
          elsif product.update(products_params.merge(user_id: @current_user.id))
            render json: ProductSerializer.new(product, options).serializable_hash.to_json
          else
            render json: { error: product.errors.messages }, status: 401
          end
        else
          render json: { error: 'Not Authorized' }, status: 401
        end
      end
    end

    def destroy
      product = Product.find_by(id: params[:id])
      if @current_user and @current_user.id == product.user_id
        if product.destroy
          head :no_content
        else
          render json: { error: product.errors.messages }, status: 401
        end
      else
        render json: { error: 'Not Authorized' }, status: 401
      end
    end

    private

    def products_params
      params.require(:product).permit(:title, :description, :summary, :price, :tags, :live, :collab_active,
                                      :thumbimageSource, :coverimageSource, collabs: %i[email share approved])
    end

    def options
      @options ||= { include: %i[reviews] }
    end
  end
end
