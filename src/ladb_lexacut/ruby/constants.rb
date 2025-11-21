module Ladb::LexaCut

    EXTENSION_NAME = 'LexaCut'.freeze
    EXTENSION_VERSION = '8.0.15'.freeze
    EXTENSION_BUILD = '202511211341'.freeze

    DEFAULT_LANGUAGE = 'en'
    # ENABLED_LANGUAGES = %w[ar cs de en es fr he hu it nl pl pt ru uk zh]
    ENABLED_LANGUAGES = %w[ar cs de en es fr hu it pl pt ru sr uk vi zh]

    FILE_FORMAT_SKP = 'skp'.freeze
    FILE_FORMAT_STL = 'stl'.freeze
    FILE_FORMAT_OBJ = 'obj'.freeze
    FILE_FORMAT_DXF = 'dxf'.freeze
    FILE_FORMAT_SVG = 'svg'.freeze

    # Cost Analysis API Configuration
    # API is ENABLED by default - set ENV['COST_API_ENABLED']='false' to disable
    COST_API_ENABLED = (ENV['COST_API_ENABLED'] != 'false').freeze
    COST_API_URL = (ENV['COST_API_URL'] || 'http://localhost:4492').freeze

end
