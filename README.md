CRUSH
=====

Installation
===

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

Testing the Connection
===

Do

```bash
crush test
```

to see if crush can connect to your server. Currently, crush only uses the "staging" server, so that's the one to specify correctly in config.json.

Getting Statistics
===

Do

```bash
crush stats
```

to see statistics for various operation types. This could be used to decide where to put your efforts in improving the protocol code base.

Pulling Code
===

To get all the Operation Type code and Library code off of an instance do

```bash
crush pull
```

For now this will pull from your staging server. If will create a directory structure that looks like this

```
staging/
  Category One/
    lib/
      Lib1/
        info.json
        source.rb
      Lib2/
        info.json
        source.rb

    op/
      OpType1/
        documentation.md
        info.json
        precondition.rb
        protocol.rb
        test.rb
    op/
      OpType2/
        documentation.md
        info.json
        precondition.rb
        protocol.rb
        test.rb
  Category Two/
    ...
```

You can commit version control this whol thing with git, for example, doing

```bash
cd staging
git init
git add .
git commit -m "Initial commit"
```
