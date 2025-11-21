module Ladb::LexaCut

  require_relative 'controller'
  require_relative '../worker/cutlist/cutlist_cost_analysis_worker'

  class CostAnalysisController < Controller

    def initialize()
      super('costanalysis')
    end

    def setup_commands

      # Calculate cost analysis
      PLUGIN.register_command("cost_analysis_calculate") do |settings|
        calculate_command(settings)
      end

    end

    # -----

    private

    def calculate_command(settings)
      
      # Get current cutlist
      cutlist_controller = PLUGIN.get_controller('cutlist')
      unless cutlist_controller
        return {
          :errors => ['Cutlist controller not found']
        }
      end

      cutlist = cutlist_controller.instance_variable_get(:@cutlist)
      unless cutlist
        return {
          :errors => ['No cutlist generated. Please generate cutlist first in the Cutlist tab.']
        }
      end

      # Extract settings
      part_ids = settings['part_ids']
      project_name = settings['project_name'] || 'Untitled Project'
      client_name = settings['client_name'] || 'Unknown Client'
      waste_percentage = settings['waste_percentage'] || 0.15

      # Run worker
      worker = CutlistCostAnalysisWorker.new(
        cutlist,
        part_ids: part_ids,
        project_name: project_name,
        client_name: client_name,
        waste_percentage: waste_percentage
      )

      response = worker.run

      response
    end

  end

end

