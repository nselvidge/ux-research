#! /usr/bin/bash

# This script is used to run the notebook server using docker
docker run -it  -p 8888:8888 -v $PWD:/home/jovyan/work -e OPENAI_API_KEY=${OPENAI_API_KEY} jupyter/datascience-notebook