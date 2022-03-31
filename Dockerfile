from node

RUN apt-get update && \
    apt-get install -y yard

RUN echo "export PATH=/home/crush:${PATH}" >> /root/.bashrc
WORKDIR /home/crush

