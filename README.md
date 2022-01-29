CRUSH
=====

To build the crush Docker image:

```bash
  docker build -t crush .
```

And to run it and log log into it

```bash
  docker run -v "$PWD:/home/crush" -it crush bash
```

The -v option mounts the current directory into the docker image's filesystem so you can access your local files forom within the image. 

Once logged into the docker instance, you should be able to execute:

```bash
crush
```