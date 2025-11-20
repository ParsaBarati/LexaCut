module Ladb
  module LexaCut

    require 'sketchup.rb'
    require_relative 'plugin'

    PLUGIN ||= Plugin.new

    unless file_loaded?(__FILE__)

      # Setup LexaCut UI integration
      PLUGIN.setup

      file_loaded(__FILE__)
    end

  end
end

