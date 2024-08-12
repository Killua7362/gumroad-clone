require 'rack/mime'
require 'google/apis/drive_v3'

module Api
  class ProductsController < ApplicationController
    include CurrentUserConcern

    def index
      render json: { error: 'Not logged in' }, status: 401 and return unless @current_user

      user = User.find_by(email: @current_user.email)
      sort_by = params[:sort_by].presence || 'updated_at'
      sort_order = (params[:reverse].presence || 'false') == 'true' ? 'desc' : 'asc'

      products = Product.search(params[:search_word].presence || '*',
                                where: { user_id: user.id },
                                fields: %i[title^10 description^1 summary^5],
                                misspellings: { below: 5 },
                                order: { "#{sort_by}" => "#{sort_order}" })

      # in meomry sorting
      # products = products.to_a.sort_by(&sort_by.to_sym)
      # products.reverse! if sort_order == :desc
      render json: ProductSerializer.new(products.to_a, options).serializable_hash.to_json
    end

    def create
      render json: { error: 'Not logged in' }, status: 401 and return unless @current_user

      product = Product.new(products_params.merge(user_id: @current_user.id))
      if product.save!
        render json: ProductSerializer.new(product, options).serializable_hash.to_json
      else
        render json: { error: product.errors.messages }, status: 401
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

          if product.folder_id.nil?
            product.folder_id = DriveUtils.create_folder("#{product.id}", @current_user.folder_id)
          end

          if params[:live] == true and !product.can_go_live
            render json: { error: 'Cannot go live because collaborators are yet to approve' }, status: 404 and return
          end

          thumbID = if params.has_key?(:thumbimageSource)
                      uploadImage('thumbimageSource', "(#{product.user_id}_#{product.id}_thumbnail)",
                                  "#{product.folder_id}")
                    else
                      product.thumbimageSource.split('?id=')[1]
                    end
          coverID = if params.has_key?(:coverimageSource)
                      uploadImage('coverimageSource', "(#{product.user_id}_#{product.id}_cover)",
                                  "#{product.folder_id}")
                    else
                      product.coverimageSource.split('?id=')[1]
                    end

          existing_ids = [thumbID, coverID]

          modifiedContents = if params.has_key?(:contents)
                               params.to_unsafe_h[:contents].map do |e|
                                 next e if e['content'].blank? # Skip if content is empty

                                 begin
                                   e['content'], existing_ids = fileUploader(e['content'], existing_ids, product.id, product.user_id,
                                                                             product.folder_id)
                                   e
                                 rescue JSON::ParserError => e
                                   render json: { error: 'Invalid contents JSON format' }, status: 400 and return
                                 end
                               end
                             else
                               product.contents.map do |e|
                                 next e if e['content'].blank?

                                 jsonObj = JSON.parse(e['content'])
                                 jsonObj['content'].map! do |node|
                                   if (node['type'] == 'file' or node['type'] == 'image') and isBase64(node['attrs']['src'])
                                     existing_ids.push(node['type'] == 'image' ? node['attrs']['src'].split('?id=')[1] : node['attrs']['src'])
                                   end
                                 end
                               end
                               product.contents
                             end

          modifiedDescription, existing_ids = if params.has_key?(:description)
                                                fileUploader(params.to_unsafe_h[:description], existing_ids, product.id, product.user_id,
                                                             product.folder_id)
                                              else
                                                unless product.description.blank?
                                                  jsonObj = JSON.parse(product.description)
                                                  jsonObj['content'].map! do |node|
                                                    if (node['type'] == 'file' or node['type'] == 'image') and isBase64(node['attrs']['src'])
                                                      existing_ids.push(node['type'] == 'image' ? node['attrs']['src'].split('?id=')[1] : node['attrs']['src'])
                                                    end
                                                  end
                                                end
                                                [product.description, existing_ids]
                                              end

          # delete other files which are not in the existing_ids

          query = "'#{product.folder_id}' in parents and trashed = false"
          drive_files = DRIVE.list_files(
            q: query
          ).files

          drive_files.each do |ele|
            next if existing_ids.include? ele.id

            DRIVE.delete_file(ele.id)
          end

          baseImageURL = 'https://drive.google.com/thumbnail?id='

          if product.update(products_params.merge(user_id: @current_user.id, thumbimageSource: "#{baseImageURL}#{thumbID}", coverimageSource: "#{baseImageURL}#{coverID}", description: modifiedDescription,
                                                  live: params['product'].keys == ['live'] ? params[:live] : false, contents: modifiedContents))
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
        DRIVE.delete_file(product.folder_id) unless product.folder_id.nil?

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
      params.require(:product).permit(:title, :description, :summary, :price, :currency_code, :tags, :live, :collab_active,
                                      :thumbimageSource, :coverimageSource, collabs: %i[email share approved], contents: %i[name content])
    end

    def options
      @options ||= { include: %i[reviews] }
    end

    def sort_products(user_id, reverse, sort_by)
      Product.where(user_id:).order("#{sort_by} #{reverse == 'true' ? 'DESC' : 'ASC'}")
    end

    def search_products(products, search_word)
      products.search(search_word)
    end

    def isBase64(base64string)
      pattern = Regexp.new('^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$')
      base64string.is_a?(String) && pattern.match?(base64string.split(',')[1])
    end

    def base64ToFile(base64string, filename, extension)
      file = Tempfile.new([filename, extension])
      file.binmode
      file.write Base64.decode64(base64string.split(',')[1])
      file.rewind
      file
    end

    def uploadImage(key, filename, folder_id)
      return params[key].split('?id=')[1] unless params.has_key?(key) and isBase64(params[key].to_s)

      signs = { "/9j/": 'image/jpeg', "iVBORw0KGgo": 'image/png' }
      extension = nil
      type = nil

      for s in signs.keys do
        if params[key].to_s.include? s.to_s
          extension = Rack::Mime::MIME_TYPES.invert[signs[s]]
          type = signs[s]
        end
      end

      image = base64ToFile(params[key], filename, extension)

      imageExist = Drive.find_files("#{filename}_#{key}", folder_id)
      image_metadata = {
        'name': "#{filename}_#{key}#{extension}",
        'mime_type': type
      }
      drive_file = if imageExist.nil?
                     DRIVE.create_file(image_metadata.merge('parents': [folder_id]), upload_source: image.path,
                                                                                     content_type: type)
                   else
                     DRIVE.update_file(imageExist.id, image_metadata, upload_source: image.path)
                   end
      drive_file.id
    end

    def fileUploader(content, existing_ids, product_id, user_id, folder_id)
      jsonObject = JSON.parse(content)

      sizes = jsonObject['content'].map do |node|
        node['type'] == 'file' ? node['attrs']['fileSize'].to_i : 0
      end

      total_size_mb = sizes.inject(0, :+) / 1e6

      render json: { error: 'Content size is larger than 10mb' }, status: 401 and return if total_size_mb > 10

      jsonObject['content'].map! do |node|
        if node['type'] == 'file' or node['type'] == 'image'
          file_name = node['attrs']['fileName']

          extension = file_name.split('.')[-1]
          file_name = file_name.split('.').drop(1).join('.')
          mime_type = Rack::Mime.mime_type(extension)

          file_metadata = {
            'name': "(#{user_id}_#{product_id}_content)_#{file_name}.#{extension}",
            'mime_type': mime_type,
            'description': node['attrs']['description']
          }

          drive_file = if isBase64(node['attrs']['src'])
                         file = base64ToFile(node['attrs']['src'], file_name, '.' + extension)
                         DRIVE.create_file(file_metadata.merge('parents': [folder_id]), upload_source: file.path,
                                                                                        content_type: mime_type)
                       else
                         DRIVE.update_file(node['type'] == 'image' ? node['attrs']['src'].split('?id=')[1] : node['attrs']['src'],
                                           file_metadata)
                       end

          node['attrs']['src'] =
            node['type'] == 'image' ? "https://drive.google.com/thumbnail?id=#{drive_file.id}" : drive_file.id
          existing_ids.push(drive_file.id)
        end
        node
      end
      [JSON.generate(jsonObject), existing_ids]
    end
  end
end

