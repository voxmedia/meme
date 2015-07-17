# Use an official docker base image running ruby 2.1
FROM ruby:2.1-onbuild

# Update the base image
RUN apt-get -y update

# Upgrade as well
RUN apt-get -qy upgrade

# Copy our app source code to a folder 
COPY ./app /usr/src/app

# Set the work directory where source is now located
WORKDIR /usr/src/app

# Install bundler
RUN cd /usr/src/app && gem install bundler

# Install dependencies
RUN cd /usr/src/app && bundle install

# Define the port where the app is going serve
EXPOSE 80

# Define the default command for starting the app that Docker would use 
CMD cd /usr/src/app && bundle exec middleman -p 80
