module Api
  class FileController < ApplicationController
    def download_drive_id(file_id, mime_type)
      extension = Rack::Mime::MIME_TYPES.invert[mime_type]
      content = DRIVE.export_file(
        file_id,
        mime_type,
        download_dest: "tmp/#{file_id}.#{extension}"
      )
      send_file "tmp/#{file_id}.#{extension}", type: mime_type, filename: "#{content.name}", disposition: 'inline'
    end
  end
end
