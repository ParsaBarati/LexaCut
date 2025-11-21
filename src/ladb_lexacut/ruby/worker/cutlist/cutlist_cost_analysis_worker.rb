module Ladb::LexaCut

  require 'net/http'
  require 'uri'
  require 'json'

  class CutlistCostAnalysisWorker

    def initialize(cutlist, part_ids: nil, project_name: nil, client_name: nil, waste_percentage: 0.15)
      @cutlist = cutlist
      @part_ids = part_ids
      @project_name = project_name || 'Untitled Project'
      @client_name = client_name || 'Unknown Client'
      @waste_percentage = waste_percentage
    end

    # -----

    def run
      return { :errors => [ 'Cost Analysis API is disabled' ] } unless COST_API_ENABLED
      return { :errors => [ 'default.error' ] } unless @cutlist
      return { :errors => [ 'tab.cutlist.error.obsolete_cutlist' ] } if @cutlist.obsolete?

      model = Sketchup.active_model
      return { :errors => [ 'tab.cutlist.error.no_model' ] } unless model

      parts = @cutlist.get_real_parts(@part_ids)
      return { :errors => [ 'tab.cutlist.error.no_part' ] } if parts.empty?

      parts_by_group = parts.group_by { |part| part.group }

      begin
        # Serialize parts data for API
        parts_data = _serialize_parts(parts_by_group)

        # Prepare project data
        project_data = {
          projectName: @project_name,
          clientName: @client_name,
          contractDate: Date.today.to_s,
          wastePercentage: @waste_percentage
        }

        # Call backend API
        result = _call_cost_api(parts_data, project_data)

        # Return success response
        {
          errors: [],
          result: result
        }

      rescue => e
        puts "Cost Analysis Error: #{e.message}"
        puts e.backtrace.join("\n")
        {
          errors: [ "Cost calculation failed: #{e.message}" ]
        }
      end
    end

    # -----

    private

    def _serialize_parts(parts_by_group)
      parts_array = []

      parts_by_group.each do |group, parts|
        parts.each do |part|
          # Skip folders
          next if part.is_a?(FolderPart)

          # Extract part data in format expected by backend
          part_data = {
            number: part.number,
            name: part.name,
            count: part.count,
            cutting_length: part.def.cutting_length.to_mm.to_f, # Convert to mm
            cutting_width: part.def.cutting_width.to_mm.to_f,
            cutting_thickness: part.def.cutting_size.thickness.to_mm.to_f,
            material_name: group.material_display_name,
            entity_names: part.entity_names.map(&:first).join(', '),
            edge_ymin: part.def.edge_materials[:ymin] ? part.def.edge_materials[:ymin].name : '',
            edge_ymax: part.def.edge_materials[:ymax] ? part.def.edge_materials[:ymax].name : '',
            edge_xmin: part.def.edge_materials[:xmin] ? part.def.edge_materials[:xmin].name : '',
            edge_xmax: part.def.edge_materials[:xmax] ? part.def.edge_materials[:xmax].name : '',
            final_area: _convert_area_to_m2(part.def.final_area) # in m²
          }

          parts_array << part_data
        end
      end

      parts_array
    end

    def _convert_area_to_m2(area_value)
      # Handle both FormulaWrapper (has to_m2 method) and Float cases
      if area_value.respond_to?(:to_m2)
        area_value.to_m2.to_f
      else
        # Assume area is in SketchUp's internal units (square inches)
        # Convert square inches to square meters: 1 in² = 0.00064516 m²
        area_value.to_f * 0.00064516
      end
    end

    def _call_cost_api(parts_data, project_data)
      uri = URI.parse("#{COST_API_URL}/api/v1/calculate/direct")

      http = Net::HTTP.new(uri.host, uri.port)
      http.read_timeout = 30
      http.open_timeout = 10

      # Use HTTPS if URL starts with https
      if uri.scheme == 'https'
        http.use_ssl = true
        http.verify_mode = OpenSSL::SSL::VERIFY_PEER
      end

      request = Net::HTTP::Post.new(uri.request_uri)
      request['Content-Type'] = 'application/json'
      request['Accept'] = 'application/json'

      payload = {
        parts: parts_data,
        projectData: project_data
      }

      request.body = JSON.generate(payload)

      puts "Calling Cost API: #{uri}"
      puts "Parts count: #{parts_data.length}"

      response = http.request(request)

      unless response.code.to_i == 200
        error_body = response.body rescue 'Unknown error'
        raise "API request failed with status #{response.code}: #{error_body}"
      end

      JSON.parse(response.body)
    end

  end

end

