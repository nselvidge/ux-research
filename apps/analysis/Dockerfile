FROM python:3

COPY ./requirements.txt /analysis/requirements.txt
COPY ./lib /analysis/lib

WORKDIR /analysis

RUN python -m venv venv
RUN . venv/bin/activate
RUN pip install -r requirements.txt

CMD ["python", "-m", "lib.main"]