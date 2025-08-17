FROM python:3.10

WORKDIR /app

RUN apt-get update && apt-get install -y libgl1

COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV DEEPFACE_HOME=/app/.deepface

RUN mkdir -p /app/.deepface && chmod -R 777 /app/.deepface

EXPOSE 7860

CMD ["gunicorn", "--bind", "0.0.0.0:7860", "ai_identity_verification_api:app"]
