FROM node:14

# Install gulp-cli
RUN npm install --global gulp-cli

# Download and bulid pdfjs
WORKDIR /
RUN git clone https://github.com/mozilla/pdf.js.git
WORKDIR /pdf.js
RUN npm install
RUN gulp generic
RUN mkdir -p /static/pdfjs
RUN mv build/generic/* /static/pdfjs

# Download and install Hugo and Go
WORKDIR /tmp
ENV HUGO_VERSION='0.80.0'
ENV HUGO_NAME="hugo_extended_${HUGO_VERSION}_Linux-64bit"
ENV GO_FILE_NAME="go1.15.7.linux-amd64.tar.gz"
ENV GO_URL="https://golang.org/dl/${GO_FILE_NAME}"
ENV HUGO_URL="https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/${HUGO_NAME}.deb"
ENV BUILD_DEPS="wget"
RUN apt update && \
    apt install -y git "${BUILD_DEPS}" && \
    wget "${HUGO_URL}" && \
    apt install "./${HUGO_NAME}.deb" && \
    rm -rf "./${HUGO_NAME}.deb" "${HUGO_NAME}" && \
    wget "${GO_URL}" && \
    tar -xvf ${GO_FILE_NAME} && \
    mv go /usr/local && \
    apt remove -y "${BUILD_DEPS}" && \
    apt autoremove -y && \
    apt clean && \
    rm -rf /var/lib/apt/lists/*

# Download & generate content, copy into place and run node & hugo servers
CMD cd /ocw-to-hugo && yarn install && cd /theme && yarn install && \
  rm -rf /ocw-data/* && mkdir /ocw-data/input && mkdir /ocw-data/output && \
  echo "{\"courses\":[\"${OCW_TEST_COURSE}\"]}" | tee /ocw-data/courses.json && \
  cd /ocw-to-hugo && node . -i ${OCW_TO_HUGO_INPUT:-/ocw-data/input} -o /ocw-data/output -c /ocw-data/courses.json --download ${OCW_TO_HUGO_DOWNLOAD:-true} && \
  rm -rf /hugo/* && mkdir /hugo/content && mkdir /hugo/data && \
  cp /theme/docker/docker.go.mod /hugo/go.mod && \
  cp /theme/docker/docker.config.toml /hugo/config.toml && \
  cp -R /ocw-data/output/content/courses/${OCW_TEST_COURSE}/* /hugo/content/ && \
  cp /ocw-data/output/data/courses/${OCW_TEST_COURSE}.json /hugo/data/course.json && \
  echo "Starting services..." && \
  export PATH=$PATH:/usr/local/go/bin && \
  /theme/docker/start.sh