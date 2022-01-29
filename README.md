CRUSH
=====

To build the crush Docker image:

```bash
  docker build -t crush .
```

Before using crush, you'll have to edit `config.json` to specify your connection to Aquarium. See `config-example.json`. 

And to run it and log log into it

```bash
  docker run -v "$PWD:/home/crush" -it crush bash
```

The -v option mounts the current directory into the docker image's filesystem so you can access your local files forom within the image. 

Once logged into the docker instance, you should be able to execute:

```bash
crush
```