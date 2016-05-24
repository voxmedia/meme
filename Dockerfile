# Use an official docker base image running ruby 2.1
FROM ruby:2.1-onbuild

# Update the base image
RUN apt-get -y update

# Upgrade as well
RUN apt-get -qy upgrade

# Set the work directory where source is now located
WORKDIR /usr/src

# Copy our app source code to a folder 
COPY Gemfile /usr/src/
COPY . /usr/src/

# Install bundler
RUN gem install bundler

# Install dependencies
RUN apt-get -y install nodejs
RUN bundle install

# Define the port where the app is going serve
EXPOSE 80

# Define the default command for starting the app that Docker would use 
CMD bundle exec middleman -p 80
