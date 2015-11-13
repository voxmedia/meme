FROM centos:7
EXPOSE 4567
ENV EXECJS_RUNTIME="RubyRacer"
ENV BUNDLE_GEMFILE="Gemfile.local"
WORKDIR /tmp/meme
ADD Gemfile* /tmp/meme/
RUN echo $'source "http://rubygems.org" \n\
 gem "therubyracer", platforms: :ruby \n\
 instance_eval(File.read(File.dirname(__FILE__) + "/Gemfile")) \n\
 ' >> /tmp/meme/Gemfile.local

RUN yum -y install \
 gcc-c++ \
 make \
 ruby \
 rubygem-bundler \
 ruby-devel && \
 bundle install && \
 yum remove -y \
 cpp \
 gcc* \
 glibc-devel \
 glibc-headers \
 kernel-headers \
 libmpc \
 libstdc++-devel \
 mpfr \
 make

ADD . /tmp/meme
CMD ["bundle", "exec", "middleman"]