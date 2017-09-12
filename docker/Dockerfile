FROM ubuntu
RUN apt-get update
RUN apt-get install build-essential chrpath libssl-dev libxft-dev -y
RUN apt-get install libfreetype6 libfreetype6-dev -y
RUN apt-get install libfontconfig1 libfontconfig1-dev -y
RUN apt-get install wget -y
RUN cd /tmp && \
    wget https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-2.1.1-linux-x86_64.tar.bz2 -nv
RUN cd /tmp && \
    tar -xf *.tar.bz2 && \
    rm *.tar.bz2 && \
    mv phantomjs-2.1.1-linux-x86_64 phantomjs && \
    cd phantomjs && rm examples -R && rm ChangeLog && rm *.BSD && rm *.md && rm *.txt && cd ../ && \
    mv phantomjs /usr/local/share/phantomjs
# RUN PATH=PATH
#  phantomjs /usr/local/share
COPY *.js /usr/local/share/phantomjs/
COPY *.sh /usr/local/share/phantomjs/
RUN ls /usr/local/share/phantomjs -al
# RUN ln -sf /usr/local/share/phantomjs/bin /usr/local/bin
#ENTRYPOINT ["/usr/local/share/phantomjs/bin/phantomjs"]
ENTRYPOINT ["/bin/bash", "/usr/local/share/phantomjs/start_phantom.sh"]
#CMD ["/usr/local/share/phantomjs/start_phantom.sh"]
