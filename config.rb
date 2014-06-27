# Reload the browser automatically whenever files change
activate :livereload

###
# Compass
###
compass_config do |config|
  config.output_style = :compressed
end

###
# Helpers
###
helpers do
  def get_url
    absolute_prefix + url_prefix
  end
end

###
# Config
###
set :css_dir, 'stylesheets'
set :js_dir, 'javascripts'
set :images_dir, 'images'
set :url_prefix, '/'
set :absolute_prefix, 'http://localhost:4567'

# Build-specific configuration
configure :build do
  puts "local build"
  set :url_prefix, ""
  set :absolute_prefix, ""
  activate :asset_hash
  activate :minify_javascript
  activate :minify_css
end
