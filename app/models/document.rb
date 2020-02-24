# frozen_string_literal: true

class Document < ActiveRecord::Base
  enum status: %i[uploaded reviewed]

  belongs_to :parking_space

end
