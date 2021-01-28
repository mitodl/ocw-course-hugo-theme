FROM node:14

# Clone ocw-to-hugo and install dependencies
WORKDIR /
RUN git clone https://github.com/mitodl/ocw-to-hugo.git
WORKDIR /ocw-to-hugo
RUN yarn install

# Download and install Hugo and Go
WORKDIR /tmp
ENV HUGO_VERSION='0.80.0'
ENV HUGO_NAME="hugo_extended_${HUGO_VERSION}_Linux-64bit"
ENV GO_FILE_NAME="go1.15.7.linux-amd64.tar.gz"
ENV GO_URL="https://golang.org/dl/${GO_FILE_NAME}"
ENV HUGO_URL="https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/${HUGO_NAME}.deb"
ENV BUILD_DEPS="wget"
RUN apt-get update && \
    apt-get install -y git "${BUILD_DEPS}" && \
    wget "${HUGO_URL}" && \
    apt-get install "./${HUGO_NAME}.deb" && \
    rm -rf "./${HUGO_NAME}.deb" "${HUGO_NAME}" && \
    wget "${GO_URL}" && \
    tar -xvf ${GO_FILE_NAME} && \
    mv go /usr/local && \
    apt-get remove -y "${BUILD_DEPS}" && \
    apt-get autoremove -y && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Download & generate content, copy into place and run node & hugo servers
CMD cd /theme && yarn install && \
  rm -rf /ocw-data/* && rm -rf /ocw-to-hugo/private && mkdir /ocw-to-hugo/private && \
  echo "{\"courses\":[\"${OCW_TEST_COURSE}\"]}" | tee /ocw-to-hugo/private/courses.json && \
  cd /ocw-to-hugo && node . -i private/courses -o /ocw-data -c private/courses.json --download && \
  rm -rf /hugo/* && mkdir /hugo/content && mkdir /hugo/data && \
  cp /theme/docker/docker.go.mod /hugo/go.mod && \
  cp /theme/docker/docker.config.toml /hugo/config.toml && \
  cp -R /ocw-data/content/courses/${OCW_TEST_COURSE}/* /hugo/content/ && \
  cp /ocw-data/data/courses/${OCW_TEST_COURSE}.json /hugo/data/course.json && \
  echo "Starting services..." && \
  export PATH=$PATH:/usr/local/go/bin && \
  /theme/docker/start.sh