from node

RUN echo "export PATH=/home/crush:${PATH}" >> /root/.bashrc
WORKDIR /home/crush

