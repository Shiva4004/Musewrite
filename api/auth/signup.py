from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import random
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class EmailVerificationRequest(BaseModel):
    email: EmailStr
    name: str

class SignupRequest(BaseModel):
    email: EmailStr
    name: str

def generate_otp():
    return ''.join([str(random.randint(0, 9)) for _ in range(6)])

def create_email_template(name: str, otp: str):
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
        <style>
            .container {{
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                font-family: 'Inter', sans-serif;
                background: #f8f9fa;
            }}
            .header {{
                background: linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d);
                color: white;
                padding: 40px 30px;
                text-align: center;
                border-radius: 20px 20px 0 0;
            }}
            .header h1 {{
                font-family: 'Playfair Display', serif;
                font-size: 36px;
                margin: 0;
                letter-spacing: 1px;
            }}
            .content {{
                background: white;
                padding: 40px 30px;
                border-radius: 0 0 20px 20px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            }}
            .otp-box {{
                background: linear-gradient(135deg, #f8f9fa, #ffffff);
                padding: 30px;
                text-align: center;
                margin: 30px 0;
                border-radius: 15px;
                border: 2px solid #fdbb2d;
            }}
            .otp-code {{
                font-size: 36px;
                letter-spacing: 8px;
                font-weight: 600;
                color: #1a2a6c;
                margin: 0;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>MUSEWRITE</h1>
                <p>Where Stories Come Alive</p>
            </div>
            <div class="content">
                <h2>Welcome, {name}!</h2>
                <div class="otp-box">
                    <p class="otp-code">{otp}</p>
                    <p>Valid for 10 minutes</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    """

@app.post("/api/send-otp")
async def send_verification_email(request: EmailVerificationRequest):
    otp = generate_otp()
    
    smtp_config = {
        'host': 'smtp.zoho.in',
        'port': 465,
        'username': os.getenv('ZOHO_MAIL'),
        'password': os.getenv('ZOHO_PASSWORD')
    }

    message = MIMEMultipart("alternative")
    message["Subject"] = "Welcome to MUSEWRITE - Verify Your Account"
    message["From"] = smtp_config['username']
    message["To"] = request.email

    html_content = create_email_template(request.name, otp)
    message.attach(MIMEText(html_content, "html"))

    try:
        with smtplib.SMTP_SSL(smtp_config['host'], smtp_config['port']) as server:
            server.login(smtp_config['username'], smtp_config['password'])
            server.send_message(message)
        return {"message": "Verification email sent", "otp": otp}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.options("/api/send-otp")
async def preflight():
    return {"message": "OK"}
