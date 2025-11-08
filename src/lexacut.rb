module Ladb
  module OpenCutList

    require 'sketchup.rb'
    require 'extensions.rb'
    require 'date'

    unless file_loaded?(__FILE__)

      if Sketchup.version_number < 1700000000
        UI.messagebox("/!\ CAUTION\nLexaCut requires SketchUp 2017 or above.", MB_OK)
      end

      # Plugin ID and DIR
      _file_ = __FILE__.dup
      _file_.force_encoding("UTF-8") if _file_.respond_to?(:force_encoding)

      PLUGIN_ID = 'ladb_lexacut'
      PLUGIN_DIR = File.join(File.dirname(_file_), PLUGIN_ID)

      # Create extension
      ex = SketchupExtension.new('LexaCut', File.join(PLUGIN_DIR, 'ruby', 'main'))
      ex.version     = "8.0.1"
      ex.copyright   = "2025 - LexaPlus - GNU GPLv3"
      ex.creator     = 'LexaPlus (Modern UI edition based on OpenCutList)'
      ex.description = 'LexaCut - Modern UI Cutting List Generator. Elegant, minimal & classy design ;)'

      # Register extension
      Sketchup.register_extension(ex, true)

      file_loaded(_file_)

    end

  end
end

