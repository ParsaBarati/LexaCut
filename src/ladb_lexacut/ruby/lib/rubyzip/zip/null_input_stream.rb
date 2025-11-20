# frozen_string_literal: true

module Ladb::LexaCut::Zip
  module NullInputStream # :nodoc:all
    include Ladb::LexaCut::Zip::NullDecompressor
    include Ladb::LexaCut::Zip::IOExtras::AbstractInputStream
  end
end

# Copyright (C) 2002, 2003 Thomas Sondergaard
# rubyzip is free software; you can redistribute it and/or
# modify it under the terms of the ruby license.
