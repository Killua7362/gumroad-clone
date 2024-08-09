class TextTransformers
  class << self
    def traverse_hash(hash, text_values)
      hash.each do |key, value|
        if key == 'text'
          text_values << value
        elsif value.is_a?(Hash)
          traverse_hash(value, text_values)
        elsif value.is_a?(Array)
          value.each { |item| traverse_hash(item, text_values) if item.is_a?(Hash) }
        end
      end
    end

    def extract_text_value_prosemirror(full_text)
      return '' if full_text == ''

      parsed_data = JSON.parse(full_text)
      text_values = []
      traverse_hash(parsed_data, text_values)
      text_values.join(' ')
    end

    def extract_main(full_text)
      if full_text.is_a?(Array)
        full_text.map { |text| extract_text_value_prosemirror(text) }
      else
        extract_text_value_prosemirror(full_text)
      end
    end
  end
end
