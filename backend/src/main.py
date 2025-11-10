from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
import uvicorn
from src.exceptions import TokenExpiredException, TokenNoFoundException
from src.user.router import router as users_router
from src.qr.router import router as qrs_router
from src.page.router import router as pages_router

app = FastAPI(title='QR')
PORT = 9000
HOST = "0.0.0.0"

app.include_router(users_router)
app.include_router(qrs_router)
app.include_router(pages_router)


@app.exception_handler(TokenExpiredException)
async def token_expired_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )


@app.exception_handler(TokenNoFoundException)
async def token_no_found_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )

if __name__ == "__main__":
    uvicorn.run('src.main:app', host = HOST, port=PORT, reload = True)