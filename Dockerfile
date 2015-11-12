FROM centos:7
EXPOSE 4567
WORKDIR /tmp/meme
RUN yum -y install ruby ruby-devel.x86_64 gcc gcc-c++ make git && \
 gem install bundle json execjs therubyracer && \
 git clone https://github.com/voxmedia/meme.git /tmp/meme && \
 /usr/local/bin/bundle install && \
 sed -i '1s/^/require "therubyracer"\n/' /usr/local/share/gems/gems/execjs-2.2.0/lib/execjs/runtimes.rb && \
 yum -y remove ruby-devel.x86_64 gcc gcc-c++ make git && yum -y autoremove

CMD ["/usr/local/bin/bundle", "exec", "middleman"]

