FROM python

COPY . .

RUN pip install -r /dependencies

WORKDIR /app

CMD [ "uvicorn", "main:app", "-b", "127.0.0.1:80" ]

EXPOSE 80
